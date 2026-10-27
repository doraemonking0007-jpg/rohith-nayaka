const DEFAULT_MENU = [
  { id: 'sandwich', name: 'Veggie sandwich', description: 'Fresh greens, tomato & mint chutney', price: 45, category: 'snacks', image_url: '', available: true, position: 0, emoji: '🥪', color: '#dcebd2' },
  { id: 'idli', name: 'Idli sambar', description: 'Fluffy idlis with warm, homestyle sambar', price: 35, category: 'breakfast', image_url: '', available: true, position: 1, emoji: '🥣', color: '#f2e7ce' },
  { id: 'poha', name: 'Masala poha', description: 'Light, lemony & topped with crunchy sev', price: 30, category: 'breakfast', image_url: '', available: true, position: 2, emoji: '🍲', color: '#f4dfc9' },
  { id: 'chai', name: 'Hot masala chai', description: 'A little ginger, a lot of comfort', price: 15, category: 'drinks', image_url: '', available: true, position: 3, emoji: '☕', color: '#e6d9cf' }
];
let CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', position: 0 },
  { id: 'lunch', name: 'Lunch', position: 1 },
  { id: 'snacks', name: 'Snacks', position: 2 },
  { id: 'drinks', name: 'Drinks', position: 3 }
];
const DEFAULT_SERVICE = { id: 1, is_open: true, service_name: 'Breakfast pickup', pickup_start: '10:00', pickup_end: '10:30', cutoff_time: '09:45', timezone: 'Asia/Kolkata' };
const ORDER_KEY = 'breakbite-orders-v1';
let MENU = DEFAULT_MENU.map(item => ({ ...item }));
let service = { ...DEFAULT_SERVICE };
let cart = {};
let orders = readOrders();
let activeOrderId = localStorage.getItem('breakbite-active') || null;
let toastTimer;
let db = null;
let backendConfigured = Boolean(window.BREAKBITE_SUPABASE_URL && window.BREAKBITE_SUPABASE_PUBLISHABLE_KEY);
let backendReady = false;
let currentUser = null;
let isStaff = false;
let staffRole = null;
let realtimeChannel = null;
let cropImage = null;
let cropObjectUrl = null;
let cropImageBounds = null;
let cropSelection = null;
let cropDrag = null;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function readOrders() {
  try { const value = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]'); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function saveLocalOrders() { if (!db) localStorage.setItem(ORDER_KEY, JSON.stringify(orders)); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function item(id) { return MENU.find(entry => entry.id === id); }
function cartCount() { return Object.values(cart).reduce((sum, count) => sum + count, 0); }
function total() { return Object.entries(cart).reduce((sum, [id, count]) => sum + (Number(item(id)?.price) || 0) * count, 0); }
function showToast(message) {
  const element = $('#toast'); element.textContent = message; element.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('show'), 3200);
}
function cropPointerPoint(event) {
  const bounds = $('#crop-canvas').getBoundingClientRect();
  return { x: (event.clientX - bounds.left) * ($('#crop-canvas').width / bounds.width), y: (event.clientY - bounds.top) * ($('#crop-canvas').height / bounds.height) };
}
function cropRatio() {
  const width = Number($('#crop-width').value) || 1200;
  const height = Number($('#crop-height').value) || 900;
  return width / height;
}
function drawCropPreview() {
  const canvas = $('#crop-canvas'); const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height); context.fillStyle = '#23342a'; context.fillRect(0, 0, canvas.width, canvas.height);
  if (!cropImage || !cropImageBounds) return;
  context.drawImage(cropImage, cropImageBounds.x, cropImageBounds.y, cropImageBounds.width, cropImageBounds.height);
  if (!cropSelection) return;
  const crop = cropSelection; context.fillStyle = '#111a1499';
  context.fillRect(cropImageBounds.x, cropImageBounds.y, cropImageBounds.width, Math.max(0, crop.y - cropImageBounds.y));
  context.fillRect(cropImageBounds.x, crop.y + crop.height, cropImageBounds.width, Math.max(0, cropImageBounds.y + cropImageBounds.height - crop.y - crop.height));
  context.fillRect(cropImageBounds.x, crop.y, Math.max(0, crop.x - cropImageBounds.x), crop.height);
  context.fillRect(crop.x + crop.width, crop.y, Math.max(0, cropImageBounds.x + cropImageBounds.width - crop.x - crop.width), crop.height);
  context.strokeStyle = '#fff'; context.lineWidth = 3; context.strokeRect(crop.x, crop.y, crop.width, crop.height);
  context.strokeStyle = '#ffffff9c'; context.lineWidth = 1;
  for (let step = 1; step <= 2; step++) {
    const x = crop.x + crop.width * step / 3; const y = crop.y + crop.height * step / 3;
    context.beginPath(); context.moveTo(x, crop.y); context.lineTo(x, crop.y + crop.height); context.stroke();
    context.beginPath(); context.moveTo(crop.x, y); context.lineTo(crop.x + crop.width, y); context.stroke();
  }
}
function resetCropSelection() {
  if (!cropImageBounds) return;
  const ratio = cropRatio(); const zoom = Number($('#crop-zoom').value) || 1;
  const maxWidth = cropImageBounds.width * 0.9; const maxHeight = cropImageBounds.height * 0.9;
  const width = Math.min(maxWidth, maxHeight * ratio) / zoom; const height = width / ratio;
  cropSelection = { x: cropImageBounds.x + (cropImageBounds.width - width) / 2, y: cropImageBounds.y + (cropImageBounds.height - height) / 2, width, height };
  drawCropPreview();
}
function clearCropImage() {
  if (cropObjectUrl) URL.revokeObjectURL(cropObjectUrl);
  cropObjectUrl = null; cropImage = null; cropImageBounds = null; cropSelection = null; cropDrag = null;
  $('#image-crop-tool').classList.add('hidden'); drawCropPreview();
}
function loadCropImage(file) {
  clearCropImage(); if (!file) return;
  const message = $('#menu-editor-message');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    message.textContent = 'Choose a JPG, PNG or WebP image smaller than 5 MB.'; $('#menu-item-image-file').value = ''; return;
  }
  message.textContent = '';
  cropObjectUrl = URL.createObjectURL(file); cropImage = new Image();
  cropImage.onload = () => {
    const scale = Math.min($('#crop-canvas').width / cropImage.naturalWidth, $('#crop-canvas').height / cropImage.naturalHeight);
    const width = cropImage.naturalWidth * scale; const height = cropImage.naturalHeight * scale;
    cropImageBounds = { x: ($('#crop-canvas').width - width) / 2, y: ($('#crop-canvas').height - height) / 2, width, height };
    $('#image-crop-tool').classList.remove('hidden'); $('#crop-preset').value = '4:3'; $('#crop-width').value = 1200; $('#crop-height').value = 900; $('#crop-zoom').value = 1;
    resetCropSelection();
  };
  cropImage.onerror = () => { message.textContent = 'This image could not be opened. Try another JPG, PNG or WebP.'; clearCropImage(); };
  cropImage.src = cropObjectUrl;
}
function croppedImageBlob() {
  return new Promise((resolve, reject) => {
    if (!cropImage || !cropImageBounds || !cropSelection) { reject(new Error('Wait for the crop preview to load, then try again.')); return; }
    const outputWidth = Number($('#crop-width').value); const outputHeight = Number($('#crop-height').value);
    if (!outputWidth || !outputHeight || outputWidth < 100 || outputHeight < 100 || outputWidth > 2000 || outputHeight > 2000) {
      reject(new Error('Crop width and height must each be between 100 and 2000 pixels.')); return;
    }
    const scale = cropImageBounds.width / cropImage.naturalWidth;
    const sourceX = (cropSelection.x - cropImageBounds.x) / scale; const sourceY = (cropSelection.y - cropImageBounds.y) / scale;
    const sourceWidth = cropSelection.width / scale; const sourceHeight = cropSelection.height / scale;
    const canvas = document.createElement('canvas'); canvas.width = outputWidth; canvas.height = outputHeight;
    canvas.getContext('2d').drawImage(cropImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not create the cropped photo.')), 'image/webp', 0.9);
  });
}
function formatTime(value) {
  if (!value) return '';
  const [hour, minute] = value.slice(0, 5).split(':').map(Number);
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2000, 0, 1, hour, minute));
}
function pickupLabel() { return `${formatTime(service.pickup_start)} – ${formatTime(service.pickup_end)}`; }
function serviceDateParts(value) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: service.timezone || 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return { year: parts.find(part => part.type === 'year')?.value, month: parts.find(part => part.type === 'month')?.value, day: parts.find(part => part.type === 'day')?.value };
}
function serviceDateKey(value) {
  const parts = serviceDateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function todayServiceDate() { return serviceDateKey(new Date()); }
function serviceTimeOfDay(value) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: service.timezone || 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value));
  const hour = Number(parts.find(part => part.type === 'hour')?.value || 0);
  return hour < 12 ? 'Morning' : hour < 18 ? 'Lunch' : 'Evening';
}
function initializeOrdersDate() {
  const today = todayServiceDate();
  $('#orders-date').value = today;
  $('#orders-date').max = today;
}
function serviceIsOpen() {
  if (!service.is_open) return false;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: service.timezone || 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const now = `${parts.find(part => part.type === 'hour')?.value}:${parts.find(part => part.type === 'minute')?.value}`;
    return now < String(service.cutoff_time || '23:59').slice(0, 5);
  } catch { return Boolean(service.is_open); }
}
function updateServiceUI() {
  const open = serviceIsOpen();
  const day = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(new Date());
  $('#service-day').textContent = day;
  $('#menu-day').textContent = day.toUpperCase();
  $('#service-name-public').textContent = service.service_name || 'Canteen pickup';
  $('#service-time-public').textContent = pickupLabel() || 'Pickup time to be announced';
  $('#cutoff-public').textContent = formatTime(service.cutoff_time) || '—';
  $('#service-status-public').textContent = open ? 'Taking orders' : 'Orders closed';
  $('#service-status-public').classList.toggle('service-closed', !open);
  $('#order-note').textContent = backendReady ? 'Your order goes to the live kitchen queue. No payment is collected.' : backendConfigured ? 'Online service unavailable — orders are not being accepted.' : 'Local demo preview — this order will not reach the kitchen.';
  $('#cart-service-label').textContent = `Pickup ${pickupLabel() || 'time to be announced'}`;
  $('#checkout').disabled = !open || !backendReady && backendConfigured;
  $('#checkout').title = open ? '' : 'Online ordering is currently closed';
  $('#staff-service-summary').textContent = `${service.service_name || 'Canteen pickup'} · ${pickupLabel()} · ${open ? 'Accepting orders' : 'Orders closed'}`;
  $('#service-open').checked = Boolean(service.is_open);
  $('#service-name').value = service.service_name || '';
  $('#pickup-start').value = String(service.pickup_start || '10:00').slice(0, 5);
  $('#pickup-end').value = String(service.pickup_end || '10:30').slice(0, 5);
  $('#order-cutoff').value = String(service.cutoff_time || '09:45').slice(0, 5);
  renderCart();
}
function updateCategories() {
  const current = $('.category.active')?.dataset.category || 'all';
  const selected = current === 'all' || CATEGORIES.some(category => category.id === current) ? current : 'all';
  $('.category-row').innerHTML = `<button class="category ${selected === 'all' ? 'active' : ''}" data-category="all">All items <span>${MENU.filter(entry => entry.available !== false).length}</span></button>${CATEGORIES.map(category => `<button class="category ${selected === category.id ? 'active' : ''}" data-category="${escapeHtml(category.id)}">${escapeHtml(category.name)}</button>`).join('')}`;
  $$('.category').forEach(button => button.addEventListener('click', () => {
    $$('.category').forEach(other => other.classList.toggle('active', other === button)); renderMenu();
  }));
}
function categoryLabel(id) { return CATEGORIES.find(category => category.id === id)?.name || 'Menu'; }
function refreshCategoryControls(selected = '') {
  $('#menu-item-category').innerHTML = CATEGORIES.map(category => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`).join('');
  $('#menu-item-category').value = CATEGORIES.some(category => category.id === selected) ? selected : (CATEGORIES[0]?.id || '');
  $('#category-manager-list').innerHTML = CATEGORIES.map(category => `<div class="category-manager-row"><span>${escapeHtml(category.name)}</span><div><button class="outline-button rename-category" type="button" data-id="${escapeHtml(category.id)}">Rename</button><button class="outline-button remove-category" type="button" data-id="${escapeHtml(category.id)}">Remove</button></div></div>`).join('');
  $$('.rename-category').forEach(button => button.addEventListener('click', () => renameCategory(button.dataset.id)));
  $$('.remove-category').forEach(button => button.addEventListener('click', () => removeCategory(button.dataset.id)));
}
async function loadCategories() {
  const { data, error } = await db.from('menu_categories').select('*').order('position').order('name');
  if (error) throw error;
  CATEGORIES = data || [];
  refreshCategoryControls($('#menu-item-category')?.value);
  updateCategories();
}
async function renameCategory(id) {
  if (!db || !backendReady) return;
  const category = CATEGORIES.find(entry => entry.id === id); if (!category) return;
  const name = window.prompt('Section name', category.name)?.trim(); if (!name || name === category.name) return;
  if (name.length > 32) { showToast('Section names can be up to 32 characters.'); return; }
  const { error } = await db.from('menu_categories').update({ name }).eq('id', id);
  if (error) { showToast(`Could not rename section: ${error.message}`); return; }
  await loadCategories(); await loadMenu(); showToast('Menu section renamed.');
}
async function removeCategory(id) {
  if (!db || !backendReady) return;
  const category = CATEGORIES.find(entry => entry.id === id); if (!category) return;
  if (MENU.some(entry => entry.category === id)) { showToast('Move or remove this section’s menu items before deleting it.'); return; }
  if (CATEGORIES.length <= 1) { showToast('Keep at least one menu section.'); return; }
  if (!window.confirm(`Remove the “${category.name}” section?`)) return;
  const { error } = await db.from('menu_categories').delete().eq('id', id);
  if (error) { showToast(`Could not remove section: ${error.message}`); return; }
  await loadCategories(); showToast('Menu section removed.');
}
async function addCategory(event) {
  event.preventDefault(); if (!db || !backendReady) { showToast('Connect the online server before editing menu sections.'); return; }
  const input = $('#new-category-name'); const name = input.value.trim();
  if (!name || name.length > 32) { showToast('Enter a section name up to 32 characters.'); return; }
  const id = `section-${crypto.randomUUID()}`;
  const { error } = await db.from('menu_categories').insert({ id, name, position: CATEGORIES.length });
  if (error) { showToast(`Could not add section: ${error.message}`); return; }
  input.value = ''; await loadCategories(); showToast('Menu section added.');
}
function renderMenu() {
  const activeCategory = $('.category.active')?.dataset.category || 'all';
  const visible = MENU.filter(entry => entry.available !== false && (activeCategory === 'all' || entry.category === activeCategory));
  $('#menu-grid').innerHTML = visible.length ? visible.map(entry => `
    <article class="menu-card"><div class="food-image" style="background:${escapeHtml(entry.color || '#e8efdf')}">
      ${entry.image_url ? `<img class="food-photo" src="${escapeHtml(entry.image_url)}" alt="${escapeHtml(entry.name)}" loading="lazy">` : `<span class="food-emoji">${escapeHtml(entry.emoji || '🍽️')}</span>`}
      <span class="food-tag">${escapeHtml(entry.tag || categoryLabel(entry.category).toUpperCase())}</span></div>
      <div class="food-info"><h3 class="food-title">${escapeHtml(entry.name)}</h3><p class="food-desc">${escapeHtml(entry.description || '')}</p>
      <div class="food-bottom"><span class="price">₹${Number(entry.price)}</span>${cart[entry.id] ? `<div class="quantity"><button data-change="-1" data-id="${escapeHtml(entry.id)}" aria-label="Remove one ${escapeHtml(entry.name)}">−</button><span>${cart[entry.id]}</span><button data-change="1" data-id="${escapeHtml(entry.id)}" aria-label="Add one ${escapeHtml(entry.name)}">+</button></div>` : `<button class="add-button" data-change="1" data-id="${escapeHtml(entry.id)}" aria-label="Add ${escapeHtml(entry.name)}">+</button>`}</div></div></article>`).join('') : '<div class="menu-empty">No items in this section right now.</div>';
  $$('.add-button,.quantity button').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.id; cart[id] = Math.max(0, (cart[id] || 0) + Number(button.dataset.change));
    if (!cart[id]) delete cart[id]; renderMenu(); renderCart();
  }));
  renderCart();
}
function renderCart() {
  const count = cartCount();
  $('#cart-bar').classList.toggle('hidden', count === 0);
  $('#cart-count').textContent = count;
  $('#cart-items-label').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  $('#cart-total').textContent = `₹${total()}`;
  $('#modal-items').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  $('#modal-price').textContent = `₹${total()}`;
  $('#checkout').disabled = !serviceIsOpen() || (backendConfigured && !backendReady);
}
function openTrack() {
  $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === 'track'));
  $('#menu-view').classList.add('hidden'); $('#track-view').classList.remove('hidden'); $('#cart-bar').classList.add('hidden');
  renderTracking(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function openMenu() {
  $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === 'menu'));
  $('#track-view').classList.add('hidden'); $('#menu-view').classList.remove('hidden'); renderCart(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
async function student() {
  if (db && isStaff) { await db.auth.signOut(); await ensureAnonymousSession(); await refreshIdentity(); await reloadOrders(); }
  $('#student-view').classList.remove('hidden'); $('#staff-view').classList.add('hidden'); openMenu();
}
function staff() {
  if (!db || !isStaff) { $('#staff-login-modal').classList.remove('hidden'); return; }
  $('#staff-identity').textContent = currentUser?.email || 'Kitchen staff';
  $('#staff-accounts-panel').classList.toggle('hidden', staffRole !== 'admin');
  $('#student-view').classList.add('hidden'); $('#staff-view').classList.remove('hidden'); renderStaff();
  loadStaffAccounts(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function activeOrder() { return orders.find(order => order.id === activeOrderId); }
function renderTracking() {
  const order = activeOrder();
  $('#empty-track').classList.toggle('hidden', Boolean(order)); $('#active-track').classList.toggle('hidden', !order);
  $('#track-status').textContent = order?.status || 'No active order'; if (!order) return;
  const labels = ['Received', 'Preparing', 'Ready', 'Collected']; const index = labels.indexOf(order.status);
  const headline = order.status === 'Ready' ? 'Your order is ready!' : order.status === 'Collected' ? 'Order collected. Enjoy!' : order.status === 'Preparing' ? 'We’re making your order.' : 'Order received!';
  const detail = order.status === 'Ready' ? 'Head to the pickup counter.' : order.status === 'Collected' ? 'Thanks for ordering with BreakBite.' : `${escapeHtml(order.name)}, pickup ${pickupLabel()}.`;
  $('#active-track').innerHTML = `<div class="token-label">YOUR PICKUP TOKEN</div><div class="token-number">${escapeHtml(order.token)}</div><h3>${headline}</h3><p>${detail}</p><div class="progress">${labels.map((label, indexValue) => `<div class="progress-step ${indexValue <= index ? 'done' : ''}">${label}</div>`).join('')}</div><div class="track-items">${(order.items || []).map(entry => `${Number(entry.qty)} × ${escapeHtml(entry.name)}`).join('<br>')}<br><strong>Total · ₹${Number(order.total)}</strong></div><button class="outline-button" id="new-order">Order something else</button>`;
  $('#new-order').onclick = () => { activeOrderId = null; localStorage.removeItem('breakbite-active'); openMenu(); };
}
function renderStaff() {
  const selectedDate = $('#orders-date').value || todayServiceDate();
  const isToday = selectedDate === todayServiceDate();
  const datedOrders = orders.filter(order => serviceDateKey(order.created_at || order.created) === selectedDate)
    .sort((a, b) => Date.parse(a.created_at || a.created) - Date.parse(b.created_at || b.created));
  const pending = datedOrders.filter(order => order.status === 'Received' || order.status === 'Preparing');
  const ready = datedOrders.filter(order => order.status === 'Ready');
  const displayDate = new Date(`${selectedDate}T12:00:00`);
  const dateLabel = isToday ? 'Today' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: service.timezone || 'Asia/Kolkata' }).format(displayDate);
  $('#stat-total').textContent = datedOrders.length; $('#stat-date-label').textContent = dateLabel;
  $('#stat-pending').textContent = pending.length; $('#stat-ready').textContent = ready.length;
  $('#stat-serving').textContent = isToday ? (ready.length ? ready[0].token : (pending[0]?.token || '—')) : '—';
  $('#orders-day-summary').textContent = `${datedOrders.length} ${datedOrders.length === 1 ? 'order' : 'orders'} · grouped by time of day${isToday ? '' : ' · history view is read-only'}`;
  $('#empty-queue').textContent = isToday ? 'No orders yet today.' : `No orders found for ${dateLabel}.`;
  $('#empty-queue').classList.toggle('hidden', datedOrders.length > 0);
  const periods = ['Morning', 'Lunch', 'Evening'];
  const rows = periods.map(period => {
    const group = datedOrders.filter(order => serviceTimeOfDay(order.created_at || order.created) === period);
    if (!group.length) return '';
    const orderRows = group.map(order => `<tr><td>${escapeHtml(order.token)}</td><td>${escapeHtml(order.name)}</td><td><span class="table-order">${(order.items || []).map(entry => `${Number(entry.qty)} × ${escapeHtml(entry.name)}`).join(', ')}</span><span class="table-sub">₹${Number(order.total)} · ${new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: service.timezone || 'Asia/Kolkata' }).format(new Date(order.created_at || order.created))}</span></td><td>${escapeHtml(pickupLabel())}</td><td><span class="table-status ${escapeHtml(String(order.status).toLowerCase())}">${escapeHtml(order.status)}</span></td><td>${!isToday ? '<span class="history-readonly">History</span>' : order.status === 'Received' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Preparing">Start preparing</button>` : order.status === 'Preparing' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Ready">Mark ready</button>` : order.status === 'Ready' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Collected">Mark collected</button>` : '✓'}</td></tr>`).join('');
    return `<tr class="period-row"><td colspan="6"><span>${period}</span><small>${group.length} ${group.length === 1 ? 'order' : 'orders'}</small></td></tr>${orderRows}`;
  }).join('');
  $('#orders-body').innerHTML = rows;
  $$('.row-action').forEach(button => button.addEventListener('click', () => setOrderStatus(button.dataset.order, button.dataset.status)));
  renderMenuManager();
}
async function reloadOrders() {
  if (!db || !backendReady) return;
  const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: true });
  if (error) { showToast(`Could not load orders: ${error.message}`); return; }
  orders = data || []; renderStaff(); renderTracking();
}
async function loadMenu() {
  const { data, error } = await db.from('menu_items').select('*').order('position').order('name');
  if (error) throw error;
  MENU = (data || []).map(row => ({ ...(DEFAULT_MENU.find(entry => entry.id === row.id) || {}), ...row })); updateCategories(); renderMenu(); renderMenuManager();
}
async function loadService() {
  const { data, error } = await db.from('service_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  service = data; updateServiceUI();
}
async function reloadOnlineData() {
  if (!db) return;
  const results = await Promise.allSettled([loadCategories(), loadService(), reloadOrders()]);
  const failure = results.find(result => result.status === 'rejected');
  if (failure) throw new Error(failure.reason?.message || String(failure.reason));
  await loadMenu();
}
async function ensureAnonymousSession() {
  if (!db) return;
  const { data } = await db.auth.getSession();
  if (data.session?.user.is_anonymous) { currentUser = data.session.user; return; }
  if (data.session) await db.auth.signOut();
  const { data: authData, error } = await db.auth.signInAnonymously();
  if (error) throw error; currentUser = authData.user;
}
async function refreshIdentity() {
  if (!db) return;
  const { data } = await db.auth.getUser(); currentUser = data.user; isStaff = false; staffRole = null;
  if (currentUser && !currentUser.is_anonymous) {
    const { data: row, error } = await db.from('staff_users').select('role,display_name').eq('user_id', currentUser.id).maybeSingle();
    if (!error && row) { isStaff = true; staffRole = row.role; $('#staff-identity').textContent = row.display_name || currentUser.email || ''; }
  }
}
async function initBackend() {
  if (!backendConfigured) {
    updateServiceUI(); $('#service-status-public').textContent = 'Demo preview · server not connected';
    $('#service-status-public').classList.add('service-closed');
    $('#staff-service-summary').textContent = 'Demo preview · connect Supabase to enable shared service controls.';
    return;
  }
  if (!window.supabase?.createClient) {
    service.is_open = false; updateServiceUI(); $('#service-status-public').textContent = 'Online service unavailable';
    $('#service-status-public').classList.add('service-closed'); showToast('The online service could not load. Check your connection and refresh.'); return;
  }
  try {
    db = window.supabase.createClient(window.BREAKBITE_SUPABASE_URL, window.BREAKBITE_SUPABASE_PUBLISHABLE_KEY);
    const { data, error } = await db.auth.getSession(); if (error) throw error;
    if (!data.session) { const result = await db.auth.signInAnonymously(); if (result.error) throw result.error; }
    await refreshIdentity(); backendReady = true;
    await reloadOnlineData();
    realtimeChannel = db.channel('breakbite-live').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, reloadOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => loadMenu().catch(error => showToast(error.message)))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, async () => { try { await loadCategories(); await loadMenu(); } catch (error) { showToast(error.message); } })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_settings' }, () => loadService().catch(error => showToast(error.message)))
      .subscribe();
    db.auth.onAuthStateChange(() => setTimeout(async () => { await refreshIdentity(); if (isStaff) await reloadOrders(); }, 0));
    updateServiceUI(); showToast('Connected to the live canteen service.');
  } catch (error) {
    backendReady = false; service.is_open = false; updateServiceUI();
    $('#service-status-public').textContent = 'Online service unavailable'; $('#service-status-public').classList.add('service-closed');
    showToast(`Online setup needs attention: ${error.message}`);
  }
}
async function setOrderStatus(id, status) {
  if (!db) { const order = orders.find(entry => entry.id === id); if (order) { order.status = status; saveLocalOrders(); renderStaff(); renderTracking(); } return; }
  const { error } = await db.from('orders').update({ status }).eq('id', id);
  if (error) { showToast(`Could not update order: ${error.message}`); return; } await reloadOrders();
}
function renderMenuManager() {
  if (!$('#menu-manager-list')) return;
  const active = MENU.filter(entry => entry.available !== false).length;
  $('#menu-manager-count').textContent = `${MENU.length} items · ${active} available to order`;
  $('#menu-manager-list').innerHTML = MENU.length ? MENU.map(entry => `<article class="menu-manager-row"><div class="manager-thumb">${entry.image_url ? `<img src="${escapeHtml(entry.image_url)}" alt="">` : escapeHtml(entry.emoji || '🍽️')}</div><div class="manager-item-info"><strong>${escapeHtml(entry.name)}</strong><small>₹${Number(entry.price)} · ${escapeHtml(categoryLabel(entry.category))} · ${entry.available === false ? 'Hidden' : 'Available'}</small></div><button class="outline-button edit-menu-item" type="button" data-id="${escapeHtml(entry.id)}">Edit</button><button class="outline-button delete-menu-item" type="button" data-id="${escapeHtml(entry.id)}">Remove</button></article>`).join('') : '<p class="menu-empty">Add the first item to your menu.</p>';
  $$('.edit-menu-item').forEach(button => button.addEventListener('click', () => openMenuEditor(button.dataset.id)));
  $$('.delete-menu-item').forEach(button => button.addEventListener('click', () => removeMenuItem(button.dataset.id)));
}
function openMenuEditor(id = '') {
  const entry = MENU.find(itemValue => itemValue.id === id);
  clearCropImage(); $('#menu-editor-form').reset(); $('#menu-item-id').value = entry?.id || '';
  $('#menu-editor-title').textContent = entry ? 'Edit menu item' : 'Add a menu item';
  $('#save-menu-item').textContent = entry ? 'Save changes' : 'Add to menu';
  $('#menu-item-name').value = entry?.name || ''; $('#menu-item-description').value = entry?.description || '';
  $('#menu-item-price').value = entry?.price ?? ''; refreshCategoryControls(entry?.category || CATEGORIES[0]?.id);
  $('#menu-item-image-url').value = entry?.image_url || ''; $('#menu-item-available').checked = entry?.available !== false;
  $('#menu-editor-message').textContent = ''; $('#menu-editor-modal').classList.remove('hidden'); $('#menu-item-name').focus();
}
async function saveMenuItem(event) {
  event.preventDefault(); if (!db || !backendReady) { showToast('Connect the online server before editing the menu.'); return; }
  const id = $('#menu-item-id').value || crypto.randomUUID(); let imageUrl = $('#menu-item-image-url').value.trim();
  if (imageUrl) { try { if (new URL(imageUrl).protocol !== 'https:') throw new Error(); } catch { $('#menu-editor-message').textContent = 'Image URL must be a valid HTTPS address.'; return; } }
  const file = $('#menu-item-image-file').files[0]; const message = $('#menu-editor-message'); const saveButton = $('#save-menu-item');
  if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) { message.textContent = 'Choose a JPG, PNG or WebP image smaller than 5 MB.'; return; }
  saveButton.disabled = true; message.textContent = file ? 'Uploading photo…' : 'Saving…';
  try {
    if (file) {
      const croppedPhoto = await croppedImageBlob();
      const path = `${id}/${crypto.randomUUID()}-cropped.webp`;
      const { error: uploadError } = await db.storage.from('menu-images').upload(path, croppedPhoto, { cacheControl: '3600', upsert: false, contentType: 'image/webp' });
      if (uploadError) throw uploadError; imageUrl = db.storage.from('menu-images').getPublicUrl(path).data.publicUrl;
    }
    const oldItem = MENU.find(entry => entry.id === id);
    const row = { id, name: $('#menu-item-name').value.trim(), description: $('#menu-item-description').value.trim(), price: Number($('#menu-item-price').value), category: $('#menu-item-category').value, image_url: imageUrl, available: $('#menu-item-available').checked, position: oldItem?.position ?? MENU.length };
    const { error } = await db.from('menu_items').upsert(row); if (error) throw error;
    $('#menu-editor-modal').classList.add('hidden'); clearCropImage(); await loadMenu(); showToast(oldItem ? 'Menu item updated.' : 'Menu item added.');
  } catch (error) { message.textContent = error.message; }
  finally { saveButton.disabled = false; }
}
async function saveServiceSettings(event) {
  event.preventDefault(); if (!db || !backendReady) { showToast('Connect the online server before changing service settings.'); return; }
  const start = $('#pickup-start').value; const end = $('#pickup-end').value; const cutoff = $('#order-cutoff').value;
  if (start >= end) { showToast('Pickup end time must be after the start time.'); return; }
  const button = $('#service-form').querySelector('button[type="submit"]'); button.disabled = true; $('#settings-save-state').textContent = 'Saving…';
  const row = { id: 1, is_open: $('#service-open').checked, service_name: $('#service-name').value.trim(), pickup_start: start, pickup_end: end, cutoff_time: cutoff };
  const { data, error } = await db.from('service_settings').upsert(row).select().single();
  button.disabled = false;
  if (error) { $('#settings-save-state').textContent = ''; showToast(`Could not save settings: ${error.message}`); return; }
  service = data; updateServiceUI(); $('#settings-save-state').textContent = 'Saved'; setTimeout(() => $('#settings-save-state').textContent = '', 2400); showToast('Service settings updated for everyone.');
}
async function removeMenuItem(id) {
  const entry = MENU.find(itemValue => itemValue.id === id); if (!entry || !confirm(`Remove “${entry.name}” from the menu?`)) return;
  const { error } = await db.from('menu_items').delete().eq('id', id);
  if (error) { showToast(`Could not remove item: ${error.message}`); return; }
  await loadMenu(); showToast('Menu item removed.');
}
async function manageStaff(action, values = {}) {
  const { data, error } = await db.functions.invoke('manage-staff', { body: { action, ...values } });
  if (error) throw error; if (data?.error) throw new Error(data.error); return data;
}
async function loadStaffAccounts() {
  if (staffRole !== 'admin') return;
  try {
    const result = await manageStaff('list');
    $('#staff-account-list').innerHTML = (result.staff || []).map(account => `<div class="staff-account-row"><span><strong>${escapeHtml(account.display_name || 'Kitchen staff')}</strong><small>${escapeHtml(account.email || '')}</small></span><button class="outline-button revoke-staff" type="button" data-id="${escapeHtml(account.user_id)}">Remove access</button></div>`).join('') || '<p class="field-help">No staff accounts have been added yet.</p>';
    $$('.revoke-staff').forEach(button => button.addEventListener('click', async () => {
      const row = button.closest('.staff-account-row'); const label = row.querySelector('strong').textContent;
      if (!confirm(`Remove staff access for ${label}?`)) return;
      try { await manageStaff('remove', { user_id: button.dataset.id }); await loadStaffAccounts(); showToast('Staff access removed.'); }
      catch (error) { showToast(`Could not remove staff: ${error.message}`); }
    }));
  } catch (error) { $('#staff-account-list').innerHTML = `<p class="field-help">Staff account service needs setup: ${escapeHtml(error.message)}</p>`; }
}
async function createStaffAccount(event) {
  event.preventDefault(); const button = $('#staff-account-form').querySelector('button[type="submit"]'); const message = $('#staff-account-message');
  button.disabled = true; message.textContent = 'Creating secure staff login…';
  try {
    const result = await manageStaff('create', { display_name: $('#new-staff-name').value.trim(), email: $('#new-staff-email').value.trim(), password: $('#new-staff-password').value });
    $('#staff-account-form').reset(); message.textContent = result.message || 'Account created. Share the login securely.'; await loadStaffAccounts();
  } catch (error) { message.textContent = error.message; }
  finally { button.disabled = false; }
}
async function uploadAndPlaceOrder(event) {
  event.preventDefault(); const name = $('#student-name').value.trim();
  if (!name) { $('#student-name').focus(); showToast('Add your name so the canteen knows who to call.'); return; }
  if (!cartCount()) { showToast('Add at least one menu item first.'); return; }
  if (!serviceIsOpen()) { showToast('Online ordering is currently closed.'); updateServiceUI(); return; }
  if (backendConfigured && !backendReady) { showToast('The online service is unavailable. Please try again shortly.'); return; }
  const button = $('#place-order'); button.disabled = true; button.textContent = 'Sending order…';
  try {
    let order;
    if (db) {
      if (!currentUser?.is_anonymous) await ensureAnonymousSession();
      const payload = Object.entries(cart).map(([id, qty]) => ({ id, qty }));
      const { data, error } = await db.rpc('place_order', { p_name: name, p_items: payload });
      if (error) throw error; order = Array.isArray(data) ? data[0] : data; await reloadOrders();
    } else {
      order = { id: crypto.randomUUID(), token: `B${String(orders.length + 1).padStart(3, '0')}`, name, items: Object.entries(cart).map(([id, qty]) => ({ name: item(id)?.name, qty })), total: total(), status: 'Received', created: Date.now() };
      orders.push(order); saveLocalOrders();
    }
    activeOrderId = order.id; localStorage.setItem('breakbite-active', activeOrderId); cart = {};
    $('#student-name').value = ''; $('#modal').classList.add('hidden'); renderMenu(); renderTracking(); openTrack(); showToast(`Order placed! Your token is ${order.token}.`);
  } catch (error) { showToast(`Order could not be sent: ${error.message}`); }
  finally { button.disabled = false; button.innerHTML = 'Place order <span>→</span>'; }
}

$$('.nav-link').forEach(button => button.addEventListener('click', () => button.dataset.view === 'track' ? openTrack() : openMenu()));
$('#staff-toggle').addEventListener('click', staff); $('#student-toggle').addEventListener('click', student);
$('#staff-signout').addEventListener('click', async () => { if (db) await db.auth.signOut(); isStaff = false; staffRole = null; await ensureAnonymousSession(); await refreshIdentity(); await reloadOrders(); student(); });
$('#browse-menu').addEventListener('click', openMenu);
$('#checkout').addEventListener('click', () => { if (serviceIsOpen()) { $('#modal').classList.remove('hidden'); $('#student-name').focus(); } });
$('#modal-close').addEventListener('click', () => $('#modal').classList.add('hidden'));
$('#modal').addEventListener('click', event => { if (event.target === $('#modal')) $('#modal').classList.add('hidden'); });
$('#place-order').addEventListener('click', uploadAndPlaceOrder);
$('#staff-login-close').addEventListener('click', () => $('#staff-login-modal').classList.add('hidden'));
$('#staff-login-modal').addEventListener('click', event => { if (event.target === $('#staff-login-modal')) $('#staff-login-modal').classList.add('hidden'); });
$('#staff-login-form').addEventListener('submit', async event => {
  event.preventDefault(); if (!db) { $('#staff-login-error').textContent = 'Connect the online server before staff can sign in.'; return; }
  const button = $('#staff-login-submit'); button.disabled = true; $('#staff-login-error').textContent = 'Signing in…';
  const { error } = await db.auth.signInWithPassword({ email: $('#staff-email').value.trim(), password: $('#staff-password').value });
  button.disabled = false;
  if (error) { $('#staff-login-error').textContent = error.message; return; }
  await refreshIdentity();
  if (!isStaff) { await db.auth.signOut(); await ensureAnonymousSession(); $('#staff-login-error').textContent = 'This login does not have kitchen staff access.'; return; }
  $('#staff-login-error').textContent = ''; $('#staff-password').value = ''; $('#staff-login-modal').classList.add('hidden'); await reloadOrders(); staff();
});
$('#service-form').addEventListener('submit', saveServiceSettings);
$('#service-open').addEventListener('change', () => { service.is_open = $('#service-open').checked; updateServiceUI(); });
$('#orders-date').addEventListener('change', renderStaff);
$('#orders-today').addEventListener('click', () => { initializeOrdersDate(); renderStaff(); });
$('#add-menu-item').addEventListener('click', () => openMenuEditor());
$('#menu-editor-close').addEventListener('click', () => { $('#menu-editor-modal').classList.add('hidden'); clearCropImage(); });
$('#menu-editor-modal').addEventListener('click', event => { if (event.target === $('#menu-editor-modal')) { $('#menu-editor-modal').classList.add('hidden'); clearCropImage(); } });
$('#menu-editor-form').addEventListener('submit', saveMenuItem);
$('#category-add-form').addEventListener('submit', addCategory);
$('#menu-item-image-file').addEventListener('change', event => loadCropImage(event.target.files[0]));
$('#crop-preset').addEventListener('change', () => {
  const sizes = { '1:1': [1200, 1200], '4:3': [1200, 900], '16:9': [1600, 900], '3:4': [900, 1200] };
  if (sizes[$('#crop-preset').value]) { $('#crop-width').value = sizes[$('#crop-preset').value][0]; $('#crop-height').value = sizes[$('#crop-preset').value][1]; resetCropSelection(); }
});
['crop-width', 'crop-height'].forEach(id => $(`#${id}`).addEventListener('input', () => { $('#crop-preset').value = 'custom'; resetCropSelection(); }));
$('#crop-zoom').addEventListener('input', resetCropSelection);
$('#crop-reset').addEventListener('click', () => { $('#crop-zoom').value = 1; resetCropSelection(); });
$('#crop-canvas').addEventListener('pointerdown', event => {
  if (!cropSelection) return;
  const point = cropPointerPoint(event);
  if (point.x < cropSelection.x || point.x > cropSelection.x + cropSelection.width || point.y < cropSelection.y || point.y > cropSelection.y + cropSelection.height) return;
  cropDrag = { point, x: cropSelection.x, y: cropSelection.y }; $('#crop-canvas').setPointerCapture(event.pointerId); event.preventDefault();
});
$('#crop-canvas').addEventListener('pointermove', event => {
  if (!cropDrag || !cropSelection || !cropImageBounds) return;
  const point = cropPointerPoint(event);
  cropSelection.x = Math.max(cropImageBounds.x, Math.min(cropImageBounds.x + cropImageBounds.width - cropSelection.width, cropDrag.x + point.x - cropDrag.point.x));
  cropSelection.y = Math.max(cropImageBounds.y, Math.min(cropImageBounds.y + cropImageBounds.height - cropSelection.height, cropDrag.y + point.y - cropDrag.point.y));
  drawCropPreview();
});
$('#crop-canvas').addEventListener('pointerup', () => { cropDrag = null; });
$('#crop-canvas').addEventListener('pointercancel', () => { cropDrag = null; });
$('#staff-account-form').addEventListener('submit', createStaffAccount);
$('#install-app').addEventListener('click', async () => {
  if (!installPrompt) { $('#install-help').classList.toggle('hidden'); return; }
  installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; $('#install-app').classList.add('hidden');
});
let installPrompt = null;
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; $('#install-app').classList.remove('hidden'); });
window.addEventListener('appinstalled', () => { $('#install-app').classList.add('hidden'); $('#install-help').classList.add('hidden'); showToast('BreakBite was installed.'); });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('./sw.js').catch(() => {});
document.addEventListener('keydown', event => { if (event.key === 'Escape') $$('.modal-backdrop').forEach(modal => modal.classList.add('hidden')); });
initializeOrdersDate(); updateCategories(); updateServiceUI(); renderMenu(); renderTracking(); renderStaff(); initBackend();
