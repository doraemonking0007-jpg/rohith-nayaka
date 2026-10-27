const DEFAULT_MENU = [
  { id: 'sandwich', name: 'Veggie sandwich', description: 'Toasted bread layered with crisp greens, tomato, cucumber and mint chutney.', price: 45, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=82', available: true, position: 0, emoji: '🥪', color: '#dcebd2' },
  { id: 'idli', name: 'Idli sambar', description: 'Soft, steamed rice cakes served with hot sambar and coconut chutney.', price: 35, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1680359873197-c3eb21ec05c0?auto=format&fit=crop&w=900&q=82', available: true, position: 1, emoji: '🥣', color: '#f2e7ce' },
  { id: 'poha', name: 'Masala poha', description: 'Light flattened rice with turmeric, peas, lemon and a crunchy sev topping.', price: 30, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=82', available: true, position: 2, emoji: '🍲', color: '#f4dfc9' },
  { id: 'chai', name: 'Hot masala chai', description: 'Freshly brewed tea simmered with milk, ginger and warming Indian spices.', price: 15, category: 'tea-coffee', image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=82', available: true, position: 3, emoji: '☕', color: '#e6d9cf' },
  { id: 'breakfast-paratha', name: 'Aloo paratha', description: 'Golden griddled flatbread stuffed with spiced potato, served with curd.', price: 45, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=82', available: true, position: 4, emoji: '🫓', color: '#f4dfc9' },
  { id: 'breakfast-upma', name: 'Vegetable upma', description: 'Comforting semolina cooked with vegetables, curry leaves and mild spices.', price: 30, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=82', available: true, position: 5, emoji: '🥣', color: '#f4dfc9' },
  { id: 'breakfast-dosa', name: 'Plain dosa', description: 'Thin, crisp fermented rice-and-lentil dosa with sambar and chutney.', price: 40, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1743615467363-250466982515?auto=format&fit=crop&w=900&q=82', available: true, position: 6, emoji: '🥞', color: '#f4dfc9' },
  { id: 'breakfast-vada', name: 'Medu vada', description: 'Crisp lentil doughnuts with a soft centre, served with sambar and chutney.', price: 30, category: 'breakfast', image_url: 'https://images.unsplash.com/photo-1680359873197-c3eb21ec05c0?auto=format&fit=crop&w=900&q=82', available: true, position: 7, emoji: '🍩', color: '#f4dfc9' },
  { id: 'tiffin-masala-dosa', name: 'Masala dosa', description: 'Crispy dosa filled with gently spiced potato masala, with sambar and chutneys.', price: 60, category: 'tiffin', image_url: 'https://images.unsplash.com/photo-1743615467363-250466982515?auto=format&fit=crop&w=900&q=82', available: true, position: 8, emoji: '🥞', color: '#f4dfc9' },
  { id: 'tiffin-idli-vada', name: 'Idli vada combo', description: 'Two fluffy idlis and one crisp medu vada with sambar and coconut chutney.', price: 50, category: 'tiffin', image_url: 'https://images.unsplash.com/photo-1680359873197-c3eb21ec05c0?auto=format&fit=crop&w=900&q=82', available: true, position: 9, emoji: '🥣', color: '#f4dfc9' },
  { id: 'tiffin-rava-dosa', name: 'Rava dosa', description: 'Lacy, crunchy semolina dosa seasoned with cumin, served with chutney.', price: 55, category: 'tiffin', image_url: 'https://images.unsplash.com/photo-1743615467363-250466982515?auto=format&fit=crop&w=900&q=82', available: true, position: 10, emoji: '🥞', color: '#f4dfc9' },
  { id: 'tiffin-uttapam', name: 'Tomato onion uttapam', description: 'Thick, soft rice-lentil pancake topped with tomato, onion and green chilli.', price: 55, category: 'tiffin', image_url: 'https://images.unsplash.com/photo-1743615467363-250466982515?auto=format&fit=crop&w=900&q=82', available: true, position: 11, emoji: '🥞', color: '#f4dfc9' },
  { id: 'tiffin-pongal', name: 'Ven pongal', description: 'Creamy rice and lentils finished with pepper, cumin, cashews and ghee.', price: 45, category: 'tiffin', image_url: 'https://images.unsplash.com/photo-1680359873197-c3eb21ec05c0?auto=format&fit=crop&w=900&q=82', available: true, position: 12, emoji: '🍚', color: '#f4dfc9' },
  { id: 'lunch-veg-thali', name: 'Homestyle veg thali', description: 'A filling plate of rice, dal, seasonal vegetable curry, roti, pickle and curd.', price: 100, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1742281258189-3b933879867a?auto=format&fit=crop&w=900&q=82', available: true, position: 13, emoji: '🍱', color: '#f4dfc9' },
  { id: 'lunch-rajma-rice', name: 'Rajma rice bowl', description: 'Slow-cooked kidney bean curry over steamed rice with a fresh onion garnish.', price: 75, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1711153419402-336ee48f2138?auto=format&fit=crop&w=900&q=82', available: true, position: 14, emoji: '🍛', color: '#f4dfc9' },
  { id: 'lunch-chole-rice', name: 'Chole rice bowl', description: 'Punjabi-style chickpea curry with fluffy rice and a squeeze of lemon.', price: 75, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1711153419402-336ee48f2138?auto=format&fit=crop&w=900&q=82', available: true, position: 15, emoji: '🍛', color: '#f4dfc9' },
  { id: 'lunch-veg-biryani', name: 'Vegetable biryani', description: 'Fragrant basmati rice layered with vegetables and whole spices, served with raita.', price: 90, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=900&q=82', available: true, position: 16, emoji: '🍲', color: '#f4dfc9' },
  { id: 'lunch-curd-rice', name: 'Curd rice', description: 'Cooling rice and yogurt tempered with mustard seeds, curry leaves and a little spice.', price: 55, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1711153419402-336ee48f2138?auto=format&fit=crop&w=900&q=82', available: true, position: 17, emoji: '🍚', color: '#f4dfc9' },
  { id: 'lunch-paneer-bowl', name: 'Paneer masala rice bowl', description: 'Soft paneer in a mild tomato masala served over steamed rice.', price: 95, category: 'lunch', image_url: 'https://images.unsplash.com/photo-1711153419402-336ee48f2138?auto=format&fit=crop&w=900&q=82', available: true, position: 18, emoji: '🍛', color: '#f4dfc9' },
  { id: 'snack-samosa', name: 'Veg samosa', description: 'Flaky pastry filled with spiced potato and peas, served with tangy chutney.', price: 20, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82', available: true, position: 19, emoji: '🥟', color: '#f4dfc9' },
  { id: 'snack-veg-puff', name: 'Vegetable puff', description: 'Crisp golden pastry with a savoury potato and vegetable filling.', price: 25, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82', available: true, position: 20, emoji: '🥐', color: '#f4dfc9' },
  { id: 'snack-noodles', name: 'Masala noodles', description: 'Hot noodles tossed with vegetables and a familiar, lightly spicy masala.', price: 45, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=82', available: true, position: 21, emoji: '🍜', color: '#f4dfc9' },
  { id: 'snack-fries', name: 'Seasoned fries', description: 'Hot, crisp potato fries dusted with a gentle house seasoning.', price: 50, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=82', available: true, position: 22, emoji: '🍟', color: '#f4dfc9' },
  { id: 'snack-pakora', name: 'Onion pakora', description: 'Crunchy onion fritters dipped in spiced gram-flour batter and fried golden.', price: 35, category: 'snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82', available: true, position: 23, emoji: '🧆', color: '#f4dfc9' },
  { id: 'drink-lime-soda', name: 'Fresh lime soda', description: 'Fresh lime, chilled soda and a pinch of salt; ask for sweet or salted.', price: 35, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=82', available: true, position: 24, emoji: '🍋', color: '#f4dfc9' },
  { id: 'drink-mango-lassi', name: 'Mango lassi', description: 'A chilled, creamy yogurt drink blended with mango and a touch of cardamom.', price: 50, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=82', available: true, position: 25, emoji: '🥭', color: '#f4dfc9' },
  { id: 'drink-buttermilk', name: 'Spiced buttermilk', description: 'Cool, savoury buttermilk with roasted cumin, coriander and a little ginger.', price: 25, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=82', available: true, position: 26, emoji: '🥛', color: '#f4dfc9' },
  { id: 'drink-lemonade', name: 'Mint lemonade', description: 'Fresh lemon and mint shaken with chilled water for a bright, refreshing drink.', price: 30, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=82', available: true, position: 27, emoji: '🍹', color: '#f4dfc9' },
  { id: 'drink-water', name: 'Packaged drinking water', description: 'Sealed bottle of chilled drinking water.', price: 20, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=82', available: true, position: 28, emoji: '💧', color: '#f4dfc9' },
  { id: 'tea-filter-coffee', name: 'South Indian filter coffee', description: 'Strong filter coffee with hot milk, poured fresh for a rich, foamy finish.', price: 25, category: 'tea-coffee', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82', available: true, position: 29, emoji: '☕', color: '#f4dfc9' },
  { id: 'tea-ginger-tea', name: 'Ginger tea', description: 'Freshly brewed milk tea with crushed ginger and a comforting spice aroma.', price: 18, category: 'tea-coffee', image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=82', available: true, position: 30, emoji: '🍵', color: '#f4dfc9' },
  { id: 'tea-black-coffee', name: 'Black coffee', description: 'A freshly brewed, bold cup of coffee served without milk.', price: 20, category: 'tea-coffee', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82', available: true, position: 31, emoji: '☕', color: '#f4dfc9' },
  { id: 'tea-cold-coffee', name: 'Cold coffee', description: 'Chilled coffee blended smooth with milk for a creamy afternoon pick-me-up.', price: 55, category: 'tea-coffee', image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=82', available: true, position: 32, emoji: '🥤', color: '#f4dfc9' }
];
let CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', position: 0 },
  { id: 'lunch', name: 'Lunch', position: 1 },
  { id: 'snacks', name: 'Snacks', position: 2 },
  { id: 'drinks', name: 'Drinks', position: 3 },
  { id: 'tiffin', name: 'Tiffin', position: 4 },
  { id: 'tea-coffee', name: 'Tea & Coffee', position: 5 }
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
let backendConnectionStarting = Boolean(window.BREAKBITE_SUPABASE_URL && window.BREAKBITE_SUPABASE_PUBLISHABLE_KEY);
let serviceSyncHealthy = false;
let serviceRefreshPromise = null;
let orderSubmissionInProgress = false;
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
function timePickerParts(value) {
  const [rawHour, rawMinute] = String(value || '00:00').slice(0, 5).split(':').map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 0;
  return { hour: String(hour % 12 || 12), minute: String(Number.isFinite(rawMinute) ? rawMinute : 0).padStart(2, '0'), meridiem: hour < 12 ? 'AM' : 'PM' };
}
function setTimePickerValue(id, value) {
  const input = $(`#${id}`); if (!input) return;
  input.value = String(value || '00:00').slice(0, 5);
  const picker = document.querySelector(`[data-time-picker="${id}"]`); if (!picker) return;
  const parts = timePickerParts(input.value);
  picker.querySelector('[data-part="hour"]').value = parts.hour;
  picker.querySelector('[data-part="minute"]').value = parts.minute;
  picker.querySelector('[data-part="meridiem"]').value = parts.meridiem;
}
function syncTimePicker(picker) {
  const hour12 = Number(picker.querySelector('[data-part="hour"]').value);
  const minute = Number(picker.querySelector('[data-part="minute"]').value);
  const meridiem = picker.querySelector('[data-part="meridiem"]').value;
  const hour24 = hour12 % 12 + (meridiem === 'PM' ? 12 : 0);
  $(`#${picker.dataset.timePicker}`).value = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
function initializeTimePickers() {
  $$('[data-time-picker]').forEach(picker => {
    const name = picker.dataset.timePicker.replaceAll('-', ' ');
    const hours = Array.from({ length: 12 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('');
    const minutes = Array.from({ length: 60 }, (_, index) => `<option value="${String(index).padStart(2, '0')}">${String(index).padStart(2, '0')}</option>`).join('');
    picker.innerHTML = `<select data-part="hour" aria-label="${name} hour">${hours}</select><span>:</span><select data-part="minute" aria-label="${name} minute">${minutes}</select><select data-part="meridiem" aria-label="${name} AM or PM"><option>AM</option><option>PM</option></select>`;
    picker.addEventListener('change', () => syncTimePicker(picker));
    setTimePickerValue(picker.dataset.timePicker, $(`#${picker.dataset.timePicker}`).value);
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
function orderSeriesPrefix(value) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: service.timezone || 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value));
  const hour = Number(parts.find(part => part.type === 'hour')?.value || 0);
  return hour < 12 ? 'B' : 'L';
}
function localOrderToken(createdAt) {
  const date = serviceDateKey(createdAt); const prefix = orderSeriesPrefix(createdAt);
  const highest = orders.filter(order => serviceDateKey(order.created_at || order.created) === date && String(order.token).startsWith(prefix))
    .reduce((maximum, order) => Math.max(maximum, Number(String(order.token).slice(1)) || 0), 0);
  return `${prefix}${highest + 1}`;
}
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
  } catch { return false; }
}
function serviceCanAcceptOrders() {
  return serviceIsOpen() && (!backendConfigured || (backendReady && serviceSyncHealthy));
}
function syncOrderAvailability() {
  const open = serviceIsOpen();
  const connected = !backendConfigured || (backendReady && serviceSyncHealthy);
  const canOrder = open && connected;
  $('#service-status-public').textContent = backendConfigured && !connected ? (backendConnectionStarting ? 'Connecting to server…' : 'Server connection unavailable') : open ? 'Taking orders' : 'Orders closed';
  $('#service-status-public').classList.toggle('service-closed', !canOrder);
  $('#staff-service-summary').textContent = `${service.service_name || 'Canteen pickup'} · ${pickupLabel()} · ${backendConfigured && !connected ? (backendConnectionStarting ? 'Connecting to server…' : 'Server connection unavailable') : open ? 'Accepting orders' : 'Orders closed'}`;
  $('#order-note').textContent = !connected ? 'The kitchen server cannot be reached. Ordering is paused until the connection returns.' : !open ? 'Online ordering is closed right now. Please check back when service reopens.' : backendReady ? 'Your order goes to the live kitchen queue. No payment is collected.' : 'Local demo preview — this order will not reach the kitchen.';
  const banner = $('#service-closed-banner');
  if (banner) {
    banner.classList.toggle('hidden', canOrder || !backendConfigured && serviceIsOpen());
    banner.textContent = backendConfigured && (!backendReady || !serviceSyncHealthy)
      ? (backendConnectionStarting ? 'Connecting to the canteen server. Ordering will be available when service status is confirmed.' : 'Reconnecting to the canteen server. Ordering is paused until service status is confirmed.')
      : 'Online ordering is closed right now. You can still browse the menu.';
  }
  $$('#menu-grid .add-button, #menu-grid .quantity button[data-change="1"]').forEach(button => {
    button.disabled = !canOrder;
    button.title = canOrder ? '' : 'Online ordering is currently unavailable';
  });
  $('#checkout').disabled = !canOrder || cartCount() === 0;
  $('#checkout').title = canOrder ? '' : 'Online ordering is currently unavailable';
  $('#place-order').disabled = !canOrder || orderSubmissionInProgress;
}
function updateServiceUI() {
  const open = serviceIsOpen();
  const connected = !backendConfigured || (backendReady && serviceSyncHealthy);
  const canOrder = open && connected;
  const day = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(new Date());
  $('#service-day').textContent = day;
  $('#menu-day').textContent = day.toUpperCase();
  $('#service-name-public').textContent = service.service_name || 'Canteen pickup';
  $('#service-time-public').textContent = pickupLabel() || 'Pickup time to be announced';
  $('#cutoff-public').textContent = formatTime(service.cutoff_time) || '—';
  $('#service-status-public').textContent = !connected ? 'Server connection unavailable' : open ? 'Taking orders' : 'Orders closed';
  $('#service-status-public').classList.toggle('service-closed', !canOrder);
  $('#order-note').textContent = !connected ? 'The kitchen server cannot be reached. Ordering is paused until the connection returns.' : !open ? 'Online ordering is closed right now. Please check back when service reopens.' : backendReady ? 'Your order goes to the live kitchen queue. No payment is collected.' : 'Local demo preview — this order will not reach the kitchen.';
  $('#cart-service-label').textContent = `Pickup ${pickupLabel() || 'time to be announced'}`;
  $('#staff-service-summary').textContent = `${service.service_name || 'Canteen pickup'} · ${pickupLabel()} · ${!connected ? 'Server connection unavailable' : open ? 'Accepting orders' : 'Orders closed'}`;
  $('#service-open').checked = Boolean(service.is_open);
  $('#service-name').value = service.service_name || '';
  setTimePickerValue('pickup-start', String(service.pickup_start || '10:00').slice(0, 5));
  setTimePickerValue('pickup-end', String(service.pickup_end || '10:30').slice(0, 5));
  setTimePickerValue('order-cutoff', String(service.cutoff_time || '09:45').slice(0, 5));
  syncOrderAvailability();
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
    if (Number(button.dataset.change) > 0 && !serviceCanAcceptOrders()) { updateServiceUI(); showToast('Online ordering is currently unavailable.'); return; }
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
  syncOrderAvailability();
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
    const orderRows = group.map(order => `<tr><td>${escapeHtml(order.token)}</td><td>${escapeHtml(order.name)}</td><td><span class="table-order">${(order.items || []).map(entry => `${Number(entry.qty)} × ${escapeHtml(entry.name)}`).join(', ')}</span><span class="table-sub">₹${Number(order.total)} · ${new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: service.timezone || 'Asia/Kolkata' }).format(new Date(order.created_at || order.created))}</span></td><td>${escapeHtml(pickupLabel())}</td><td><span class="table-status ${escapeHtml(String(order.status).toLowerCase())}">${escapeHtml(order.status)}</span></td><td>${!isToday ? '<span class="history-readonly">History</span>' : order.status === 'Received' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Preparing">Start preparing</button>` : order.status === 'Preparing' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Ready">Mark ready</button>` : order.status === 'Ready' ? `<button class="row-action" data-order="${escapeHtml(order.id)}" data-status="Collected">Mark collected</button>` : '✓'}</td></tr>`).join('');
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
  service = data; serviceSyncHealthy = true; updateServiceUI();
}
function markServiceUnavailable(error) {
  const wasHealthy = serviceSyncHealthy;
  serviceSyncHealthy = false; updateServiceUI();
  if (wasHealthy) showToast(`Kitchen connection lost. Ordering is paused while we reconnect${error?.message ? `: ${error.message}` : '.'}`);
}
async function refreshServiceStatus() {
  if (!backendConfigured) return true;
  if (!db || !backendReady) { markServiceUnavailable(); return false; }
  if (serviceRefreshPromise) return serviceRefreshPromise;
  serviceRefreshPromise = (async () => {
    try { await loadService(); return true; }
    catch (error) { markServiceUnavailable(error); return false; }
    finally { serviceRefreshPromise = null; }
  })();
  return serviceRefreshPromise;
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
    backendConnectionStarting = false;
    updateServiceUI(); $('#service-status-public').textContent = 'Demo preview · server not connected';
    $('#service-status-public').classList.add('service-closed');
    $('#staff-service-summary').textContent = 'Demo preview · connect Supabase to enable shared service controls.';
    return;
  }
  if (!window.supabase?.createClient) {
    backendConnectionStarting = false;
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_settings' }, () => refreshServiceStatus())
      .subscribe();
    db.auth.onAuthStateChange(() => setTimeout(async () => { await refreshIdentity(); if (isStaff) await reloadOrders(); }, 0));
    backendConnectionStarting = false; updateServiceUI(); showToast('Connected to the live canteen service.');
  } catch (error) {
    backendReady = false; backendConnectionStarting = false; serviceSyncHealthy = false; service.is_open = false; updateServiceUI();
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
  const button = $('#service-form').querySelector('button[type="submit"]'); const availabilitySwitch = $('#service-open');
  button.disabled = true; availabilitySwitch.disabled = true; $('#settings-save-state').textContent = 'Saving…';
  const row = { id: 1, is_open: $('#service-open').checked, service_name: $('#service-name').value.trim(), pickup_start: start, pickup_end: end, cutoff_time: cutoff };
  let data; let error;
  try { ({ data, error } = await db.from('service_settings').upsert(row).select().single()); }
  catch (requestError) { error = requestError; }
  button.disabled = false; availabilitySwitch.disabled = false;
  if (error) { $('#settings-save-state').textContent = ''; showToast(`Could not save settings: ${error.message}`); await refreshServiceStatus(); return; }
  service = data; updateServiceUI(); $('#settings-save-state').textContent = 'Saved'; setTimeout(() => $('#settings-save-state').textContent = '', 2400); showToast('Service settings updated for everyone.');
}
async function saveServiceAvailability(event) {
  const input = event.currentTarget; const requested = input.checked; const previous = Boolean(service.is_open);
  if (!db || !backendReady) { input.checked = previous; showToast('The canteen server is unavailable; order status was not changed.'); return; }
  const draft = { name: $('#service-name').value, times: ['pickup-start', 'pickup-end', 'order-cutoff'].map(id => [id, $(`#${id}`).value]) };
  const saveButton = $('#service-form').querySelector('button[type="submit"]');
  input.disabled = true; saveButton.disabled = true; $('#settings-save-state').textContent = 'Updating order status…';
  service.is_open = requested; updateServiceUI();
  draft.times.forEach(([id, value]) => setTimePickerValue(id, value)); $('#service-name').value = draft.name;
  let data; let error;
  try { ({ data, error } = await db.from('service_settings').update({ is_open: requested }).eq('id', 1).select().single()); }
  catch (requestError) { error = requestError; }
  input.disabled = false; saveButton.disabled = false;
  if (error) {
    service.is_open = previous; input.checked = previous; updateServiceUI();
    draft.times.forEach(([id, value]) => setTimePickerValue(id, value)); $('#service-name').value = draft.name;
    $('#settings-save-state').textContent = ''; showToast(`Could not update order status: ${error.message}`); await refreshServiceStatus(); return;
  }
  service = data; serviceSyncHealthy = true; updateServiceUI();
  draft.times.forEach(([id, value]) => setTimePickerValue(id, value)); $('#service-name').value = draft.name;
  $('#settings-save-state').textContent = 'Saved'; setTimeout(() => $('#settings-save-state').textContent = '', 2400);
  showToast(requested ? 'Online ordering is now on for everyone.' : 'Online ordering is now off for everyone.');
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
  if (orderSubmissionInProgress) return;
  if (!name) { $('#student-name').focus(); showToast('Add your name so the canteen knows who to call.'); return; }
  if (!cartCount()) { showToast('Add at least one menu item first.'); return; }
  orderSubmissionInProgress = true;
  const button = $('#place-order'); button.disabled = true; button.textContent = 'Checking service…';
  try {
    if (backendConfigured && !await refreshServiceStatus()) { showToast('Could not confirm the kitchen status. Please check your connection and try again.'); return; }
    if (!serviceCanAcceptOrders()) { updateServiceUI(); showToast('Online ordering is closed right now.'); return; }
    button.textContent = 'Sending order…';
    let order;
    if (db) {
      if (!currentUser?.is_anonymous) await ensureAnonymousSession();
      const payload = Object.entries(cart).map(([id, qty]) => ({ id, qty }));
      const { data, error } = await db.rpc('place_order', { p_name: name, p_items: payload });
      if (error) throw error; order = Array.isArray(data) ? data[0] : data; await reloadOrders();
    } else {
      const created = new Date();
      order = { id: crypto.randomUUID(), token: localOrderToken(created), name, items: Object.entries(cart).map(([id, qty]) => ({ name: item(id)?.name, qty })), total: total(), status: 'Received', created: created.toISOString() };
      orders.push(order); saveLocalOrders();
    }
    activeOrderId = order.id; localStorage.setItem('breakbite-active', activeOrderId); cart = {};
    $('#student-name').value = ''; $('#modal').classList.add('hidden'); renderMenu(); renderTracking(); openTrack(); showToast(`Order placed! Your token is ${order.token}.`);
  } catch (error) {
    if (/ordering is closed|cutoff time has passed/i.test(error.message || '')) await refreshServiceStatus();
    showToast(`Order could not be sent: ${error.message}`);
  }
  finally { orderSubmissionInProgress = false; button.innerHTML = 'Place order <span>→</span>'; syncOrderAvailability(); }
}

$$('.nav-link').forEach(button => button.addEventListener('click', () => button.dataset.view === 'track' ? openTrack() : openMenu()));
$('#staff-toggle').addEventListener('click', staff); $('#student-toggle').addEventListener('click', student);
$('#staff-signout').addEventListener('click', async () => { if (db) await db.auth.signOut(); isStaff = false; staffRole = null; await ensureAnonymousSession(); await refreshIdentity(); await reloadOrders(); student(); });
$('#browse-menu').addEventListener('click', openMenu);
$('#checkout').addEventListener('click', async () => {
  if (backendConfigured && !await refreshServiceStatus()) { showToast('Could not confirm the kitchen status. Please try again.'); return; }
  if (serviceCanAcceptOrders()) { $('#modal').classList.remove('hidden'); $('#student-name').focus(); }
  else { updateServiceUI(); showToast('Online ordering is closed right now.'); }
});
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
$('#service-open').addEventListener('change', saveServiceAvailability);
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
let installPrompt = null;
function appIsInstalled() { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
function showInstallHelp() {
  const help = $('#install-help');
  const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  help.innerHTML = isAppleMobile
    ? 'On your iPhone or iPad, open BreakBite in <strong>Safari</strong>, tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.'
    : 'Open this site in your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.';
  help.classList.toggle('hidden');
}
$('#install-app').addEventListener('click', async () => {
  if (!installPrompt) { showInstallHelp(); return; }
  installPrompt.prompt();
  const choice = await installPrompt.userChoice;
  installPrompt = null;
  if (choice?.outcome === 'accepted') $('#install-app').classList.add('hidden');
});
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; $('#install-app').classList.remove('hidden'); });
window.addEventListener('appinstalled', () => { $('#install-app').classList.add('hidden'); $('#install-help').classList.add('hidden'); showToast('BreakBite was installed.'); });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('./sw.js').catch(() => {});
document.addEventListener('keydown', event => { if (event.key === 'Escape') $$('.modal-backdrop').forEach(modal => modal.classList.add('hidden')); });
setInterval(syncOrderAvailability, 1000);
setInterval(() => { if (document.visibilityState === 'visible' && backendConfigured) refreshServiceStatus(); }, 15000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && backendConfigured) refreshServiceStatus(); });
window.addEventListener('focus', () => { if (backendConfigured) refreshServiceStatus(); });
initializeTimePickers(); initializeOrdersDate(); updateCategories(); updateServiceUI(); renderMenu(); renderTracking(); renderStaff();
if (appIsInstalled()) $('#install-app').classList.add('hidden');
initBackend();
