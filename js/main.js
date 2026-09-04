let products = [];
let cart = [];

// 1. Backend Integration: Mengambil data JSON statis
async function fetchProducts() {
  try {
    const response = await fetch('../backend/data/food_items.json');
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Gagal memuat data produk:', error);
  }
}

// 2. Render katalog ke HTML
function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  products.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Kategori: ${item.category}</p>
      <p>Harga: <strong>${item.price} Gold</strong></p>
      <button onclick="addToCart('${item.id}')">Tambah ke Keranjang</button>
    `;
    container.appendChild(card);
  });
}

// 3. Logika Keranjang Belanja
function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  if (item) {
    cart.push(item);
    updateCartUI();
  }
}

function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.length;
  
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';
  
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerText = `${item.name} - ${item.price} Gold`;
    cartList.appendChild(li);
  });

  document.getElementById('total-price').innerText = total;
}

// 4. Sistem Transaksi Tanpa SQL (Checkout Direct ke WhatsApp Admin)
function checkoutWA() {
  if (cart.length === 0) {
    alert('Keranjang kamu masih kosong!');
    return;
  }

  const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp Penjual
  let message = 'Halo Admin, saya ingin membeli item Hay Day Food:\n\n';
  
  let total = 0;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - ${item.price} Gold\n`;
    total += item.price;
  });

  message += `\n*Total Harga:* ${total} Gold`;
  
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Inisialisasi awal
fetchProducts();

