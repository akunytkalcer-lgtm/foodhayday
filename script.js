// Daftar Produk Food & Item yang dijual
const products = [
  { id: 1, name: 'Food / Makanan Ternak', price: 1000, img: '🌾' },
  { id: 2, name: 'Bahan Bangunan (BOM/SEM)', price: 2000, img: '🪵' },
  { id: 3, name: 'Alat Tambang (TNT/Dinamit)', price: 1500, img: '💣' },
  { id: 4, name: 'Kue & Bakery', price: 2500, img: '🍰' },
  { id: 5, name: 'Gula & Sirup', price: 1800, img: '🍯' },
  { id: 6, name: 'Paket Kombo Mesin', price: 5000, img: '⚙️' }
];

let cart = [];

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const orderForm = document.getElementById('orderForm');

// Tampilkan Produk ke Tampilan Depan
function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div style="font-size: 40px;">${p.img}</div>
      <h4>${p.name}</h4>
      <p class="product-price">Rp ${p.price.toLocaleString('id-ID')} / unit</p>
      <button class="btn-add" onclick="addToCart(${p.id})">+ Tambah</button>
    `;
    productGrid.appendChild(card);
  });
}

// Tambah ke Keranjang
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

// Hapus atau Kurangi Item
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// Update Tampilan Keranjang
function updateCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Keranjang masih kosong. Silakan pilih item di atas.</td></tr>`;
    totalPriceEl.innerText = 'Rp 0';
    return;
  }

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}x</td>
      <td>Rp ${itemTotal.toLocaleString('id-ID')}</td>
      <td><button onclick="removeFromCart(${item.id})" style="color:red; border:none; background:none; cursor:pointer;">❌</button></td>
    `;
    cartItems.appendChild(row);
  });

  totalPriceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Kirim Pesanan ke WA Admin (087888307856)
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Keranjang belanja kamu masih kosong!');
    return;
  }

  const name = document.getElementById('buyerName').value;
  const tag = document.getElementById('buyerTag').value;

  let text = `Halo Admin, saya mau pesan item Hay Day berikut:\n\n`;
  text += `👤 *Nama:* ${name}\n`;
  text += `🏷️ *Tag Farm:* ${tag}\n\n`;
  text += `📦 *Rincian Pesanan:*\n`;

  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    text += `- ${item.name} (${item.qty}x) = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
  });

  text += `\n💰 *Total Harga:* Rp ${total.toLocaleString('id-ID')}\n\n`;
  text += `Mohon direspon ya min, terima kasih!`;

  const waUrl = `https://wa.me/6287888307856?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
});

// Jalankan saat pertama kali dibuka
renderProducts();
