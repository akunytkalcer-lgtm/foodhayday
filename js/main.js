let products = [];
let cart = {};

async function fetchProducts() {
  try {
    const response = await fetch('./backed/food.json');
    if (!response.ok) throw new Error('File JSON tidak ditemukan');
    
    products = await response.json();
    updateStats();
    renderGroupedProducts();
  } catch (error) {
    console.error('Gagal memuat data produk:', error);
  }
}

function updateStats() {
  const categories = new Set(products.map(p => p.category));
  document.getElementById('total-stats').innerText = `${products.length} food · ${categories.size} mesin`;
}

function renderGroupedProducts() {
  const container = document.getElementById('catalog-container');
  container.innerHTML = '';

  // Kelompokkan produk berdasarkan kategori/mesin
  const grouped = products.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  for (const [category, items] of Object.entries(grouped)) {
    const section = document.createElement('section');
    
    // Header Kategori
    section.innerHTML = `
      <div class="section-header">
        <h2>${category}</h2>
        <span>${items.length} food</span>
      </div>
    `;

    // Item Card
    items.forEach(item => {
      const qty = cart[item.id] || 0;
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-left">
          <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="card-info">
            <div class="lvl-badge">Lvl ${item.level || 1}</div>
            <h3>${item.name}</h3>
            <div class="sub-title">${item.englishName || item.name}</div>
          </div>
        </div>
        <div class="counter-control">
          <button class="counter-btn" onclick="changeQty('${item.id}', -1)">-</button>
          <span class="counter-value" id="qty-${item.id}">${qty}</span>
          <button class="counter-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      `;
      section.appendChild(card);
    });

    container.appendChild(section);
  }
}

function changeQty(id, delta) {
  const current = cart[id] || 0;
  const updated = current + delta;

  if (updated <= 0) {
    delete cart[id];
  } else {
    cart[id] = updated;
  }

  // Update angka pada item tersebut
  const qtyElem = document.getElementById(`qty-${id}`);
  if (qtyElem) qtyElem.innerText = cart[id] || 0;

  updateCartUI();
}

function updateCartUI() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('bar-item-count').innerText = `${totalItems} item`;
}

function checkoutWA() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  if (totalItems === 0) {
    alert('Pilih minimal 1 item makanan terlebih dahulu!');
    return;
  }

  const phoneNumber = '6281234567890'; // Ubah dengan nomor WA kamu
  let message = 'Halo Admin, saya mau pesan item Hay Day berikut:\n\n';

  for (const [id, qty] of Object.entries(cart)) {
    const item = products.find(p => p.id === id);
    if (item) {
      message += `• ${item.name} x${qty}\n`;
    }
  }

  message += `\n*Total Item:* ${totalItems} item`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

fetchProducts();
