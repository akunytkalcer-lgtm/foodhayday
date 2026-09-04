// Daftar Produk
const products = [
  { id: 1, name: 'Food/Makanan Ternak', price: 1000, icon: '🌾' },
  { id: 2, name: 'BOM / SEM (Lahan)', price: 2000, icon: '🪵' },
  { id: 3, name: 'BEM (Lumbung/Barn)', price: 2000, icon: '🏠' },
  { id: 4, name: 'Alat Tambang (TNT)', price: 1500, icon: '💣' },
  { id: 5, name: 'Kue & Makanan', price: 2500, icon: '🍰' },
  { id: 6, name: 'Susu & Keju', price: 1800, icon: '🧀' }
];

let cart = [];

const productGrid = document.getElementById('productGrid');
const cartList = document.getElementById('cartList');
const totalPriceEl = document.getElementById('totalPrice');
const orderForm = document.getElementById('orderForm');

// Render Katalog
function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-icon">${p.icon}</div>
      <h4>${p.name}</h4>
      <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
      <button class="btn-add" onclick="addToCart(${p.id})">+ Tambah</button>
    `;
    productGrid.appendChild(card);
  });
}

// Tambah ke Pesanan
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

// Hapus
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

// Update Keranjang
function updateCart() {
  if (cart.length === 0) {
    cartList.innerHTML = `<p class="empty-text">Pilih produk di atas untuk menambahkan ke pesanan.</p>`;
    totalPriceEl.innerText = 'Rp 0';
    return;
  }

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span><strong>${item.name}</strong> (${item.qty}x)</span>
      <span>Rp ${itemTotal.toLocaleString('id-ID')} 
        <button onclick="removeFromCart(${item.id})" style="color:red; border:none; background:none; cursor:pointer; margin-left:8px;">✕</button>
      </span>
    `;
    cartList.appendChild(div);
  });

  totalPriceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Kirim ke WhatsApp (087888307856)
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Pilih minimal 1 produk terlebih dahulu!');
    return;
  }

  const name = document.getElementById('buyerName').value;
  const tag = document.getElementById('buyerTag').value;

  let message = `Halo Admin Hay Day Store, saya mau pesan:\n\n`;
  message += `👤 *Nama:* ${name}\n`;
  message += `🏷️ *Tag Farm:* ${tag}\n\n`;
  message += `🛒 *Rincian Pesanan:*\n`;

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `- ${item.name} x${item.qty} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
  });

  message += `\n💰 *Total:* Rp ${total.toLocaleString('id-ID')}\n\n`;
  message += `Mohon diproses ya min, terima kasih!`;

  const waUrl = `https://wa.me/6287888307856?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
});

renderProducts();
