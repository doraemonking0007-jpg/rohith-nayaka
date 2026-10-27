const DEFAULT_MENU = [
  { id: 'sandwich', name: 'Veggie sandwich', description: 'Fresh greens, tomato & mint chutney', price: 45, category: 'quick', image_url: '', available: true, position: 0, emoji: '🥪', color: '#dcebd2' },
  { id: 'idli', name: 'Idli sambar', description: 'Fluffy idlis with warm, homestyle sambar', price: 35, category: 'hot', image_url: '', available: true, position: 1, emoji: '🥣', color: '#f2e7ce' },
  { id: 'poha', name: 'Masala poha', description: 'Light, lemony & topped with crunchy sev', price: 30, category: 'quick', image_url: '', available: true, position: 2, emoji: '🍲', color: '#f4dfc9' },
  { id: 'chai', name: 'Hot masala chai', description: 'A little ginger, a lot of comfort', price: 15, category: 'drinks', image_url: '', available: true, position: 3, emoji: '☕', color: '#e6d9cf' }
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
function formatTime(value) {
  if (!value) return '';
  const [hour, minute] = value.slice(0, 5).split(':').map(Number);
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2000, 0, 1, hour, minute));
}
function pickupLabel() { return `${formatTime(service.pickup_start)} – ${formatTime(service.pickup_end)}`; }
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
  const categories = [...new Set(MENU.map(entry => entry.category).filter(Boolean))];
  const labels = { quick: 'Quick bites', hot: 'Hot breakfast', drinks: 'Drinks' };
  const selected = $('.category.active')?.dataset.category || 'all';
  $('.category-row').innerHTML = `<button class="category ${selected === 'all' ? 'active' : ''}" data-category="all">All items <span>${MENU.filter(entry => entry.available !== false).length}</span></button>${categories.map(category => `<button class="category ${selected === category ? 'active' : ''}" data-category="${escapeHtml(category)}">${escapeHtml(labels[category] || category)}</button>`).join('')}`;
  $$('.category').forEach(button => button.addEventListener('click', () => {
    $$('.category').forEach(other => other.classList.toggle('active', other === button)); renderMenu();
  }));
}
function renderMenu() {
  const activeCategory = $('.category.active')?.dataset.category || 'all';
  const visible = MENU.filter(entry => entry.available !== false && (activeCategory === 'all' || entry.category === activeCategory));
  $('#menu-grid').innerHTML = visible.length ? visible.map(entry => `
    <article class="menu-card"><div class="food-image" style="background:${escapeHtml(entry.color || '#e8efdf')}">
      ${entry.image_url ? `<img class="food-photo" src="${escapeHtml(entry.image_url)}" alt="${escapeHtml(entry.name)}" loading="lazy">` : `<span class="food-emoji">${escapeHtml(entry.emoji || '🍽️')}</span>`}
      <span class="food-tag">${escapeHtml(entry.tag || (entry.category || 'MENU ITEM').toUpperCase())}</span></div>
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
  const sorted = [...orders].sort((a, b) => Date.parse(a.created_at || a.created) - Date.parse(b.created_at || b.created));
  const pending = sorted.filter(order => order.status === 'Received' || order.status === 'Preparing');
  const ready = sorted.filter(order => order.status === 'Ready');
  $('#stat-total').textContent = orders.length; $('#stat-pending').textContent = pending.length; $('#stat-ready').textContent = ready.length;
  $('#stat-serving').textContent = ready.length ? ready[0].token : (pending[0]?.token || '—');
  $('#empty-queue').classList.toggle('hidden', sorted.length > 0);
  $('#orders-body').innerHTML = sorted.map(order => `<tr><td>${escapeHtml(order.token)}</td><td>${escapeHtml(order.name)}</td><td><span class="table-order">${(order.items || []).map(entry => `${Number(entry.qty)} × ${escapeHtml(entry.name)}`).join(', ')}</span><span class="table-sub">₹${Number(order.total)} · ${new Date(order.created_at || order.created).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></td><td>${escapeHtml(pickupLabel())}</td><td><span class="table-status ${escapeHtml(String(order.status).toLowerCase())}">${escapeHtml(order.status)}</span></td><td>${order.status === 'Received' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Preparing">Start preparing</button>` : order.status === 'Preparing' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Ready">Mark ready</button>` : order.status === 'Ready' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Collected">Mark collected</button>` : '✓'}</td></tr>`).join('');
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
  const results = await Promise.allSettled([loadMenu(), loadService(), reloadOrders()]);
  const failure = results.find(result => result.status === 'rejected');
  if (failure) throw new Error(failure.reason?.message || String(failure.reason));
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
  $('#menu-manager-list').innerHTML = MENU.length ? MENU.map(entry => `<article class="menu-manager-row"><div class="manager-thumb">${entry.image_url ? `<img src="${escapeHtml(entry.image_url)}" alt="">` : escapeHtml(entry.emoji || '🍽️')}</div><div class="manager-item-info"><strong>${escapeHtml(entry.name)}</strong><small>₹${Number(entry.price)} · ${escapeHtml(entry.category)} · ${entry.available === false ? 'Hidden' : 'Available'}</small></div><button class="outline-button edit-menu-item" type="button" data-id="${escapeHtml(entry.id)}">Edit</button><button class="outline-button delete-menu-item" type="button" data-id="${escapeHtml(entry.id)}">Remove</button></article>`).join('') : '<p class="menu-empty">Add the first item to your menu.</p>';
  $$('.edit-menu-item').forEach(button => button.addEventListener('click', () => openMenuEditor(button.dataset.id)));
  $$('.delete-menu-item').forEach(button => button.addEventListener('click', () => removeMenuItem(button.dataset.id)));
}
function openMenuEditor(id = '') {
  const entry = MENU.find(itemValue => itemValue.id === id);
  $('#menu-editor-form').reset(); $('#menu-item-id').value = entry?.id || '';
  $('#menu-editor-title').textContent = entry ? 'Edit menu item' : 'Add a menu item';
  $('#save-menu-item').textContent = entry ? 'Save changes' : 'Add to menu';
  $('#menu-item-name').value = entry?.name || ''; $('#menu-item-description').value = entry?.description || '';
  $('#menu-item-price').value = entry?.price ?? ''; $('#menu-item-category').value = entry?.category || 'quick';
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
      const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const { error: uploadError } = await db.storage.from('menu-images').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
      if (uploadError) throw uploadError; imageUrl = db.storage.from('menu-images').getPublicUrl(path).data.publicUrl;
    }
    const oldItem = MENU.find(entry => entry.id === id);
    const row = { id, name: $('#menu-item-name').value.trim(), description: $('#menu-item-description').value.trim(), price: Number($('#menu-item-price').value), category: $('#menu-item-category').value, image_url: imageUrl, available: $('#menu-item-available').checked, position: oldItem?.position ?? MENU.length };
    const { error } = await db.from('menu_items').upsert(row); if (error) throw error;
    $('#menu-editor-modal').classList.add('hidden'); await loadMenu(); showToast(oldItem ? 'Menu item updated.' : 'Menu item added.');
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
$('#add-menu-item').addEventListener('click', () => openMenuEditor());
$('#menu-editor-close').addEventListener('click', () => $('#menu-editor-modal').classList.add('hidden'));
$('#menu-editor-modal').addEventListener('click', event => { if (event.target === $('#menu-editor-modal')) $('#menu-editor-modal').classList.add('hidden'); });
$('#menu-editor-form').addEventListener('submit', saveMenuItem);
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
updateCategories(); updateServiceUI(); renderMenu(); renderTracking(); renderStaff(); initBackend();
