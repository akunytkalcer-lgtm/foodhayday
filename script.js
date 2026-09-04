let machines = [];

const machineForm = document.getElementById('machineForm');
const machineList = document.getElementById('machineList');
const totalFoodEl = document.getElementById('totalFood');
const totalMesinEl = document.getElementById('totalMesin');
const maxLevelEl = document.getElementById('maxLevel');

const modal = document.getElementById('checkoutModal');
const btnCheckout = document.getElementById('btnCheckout');
const closeBtn = document.querySelector('.close-btn');
const checkoutDetails = document.getElementById('checkoutDetails');
const btnConfirmWa = document.getElementById('btnConfirmWa');

// Tambah Data Mesin
machineForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('machineName').value;
  const level = parseInt(document.getElementById('machineLevel').value);

  machines.push({ name, level });
  machineForm.reset();
  updateUI();
});

// Urutkan A-Z dan Level Bawah ke Tinggi
function updateUI() {
  machines.sort((a, b) => {
    if (a.name.localeCompare(b.name) !== 0) {
      return a.name.localeCompare(b.name);
    }
    return a.level - b.level;
  });

  machineList.innerHTML = '';
  let maxLvl = 0;

  machines.forEach((item, index) => {
    if (item.level > maxLvl) maxLvl = item.level;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>Lvl ${item.level}</td>
      <td><button onclick="deleteMachine(${index})" style="color: red; border: none; background: none; cursor: pointer;">Hapus</button></td>
    `;
    machineList.appendChild(row);
  });

  // Update Statistik
  totalMesinEl.innerText = machines.length;
  totalFoodEl.innerText = machines.length * 10; // Logika kalkulasi food sederhana
  maxLevelEl.innerText = machines.length > 0 ? `Lvl ${maxLvl}` : 'Lvl 0';
}

function deleteMachine(index) {
  machines.splice(index, 1);
  updateUI();
}

// Tampilan Javascript saat Checkout
btnCheckout.addEventListener('click', () => {
  if (machines.length === 0) {
    alert('Belum ada mesin yang diinput!');
    return;
  }

  let html = '<ul>';
  machines.forEach(m => {
    html += `<li><strong>${m.name}</strong> - Level ${m.level}</li>`;
  });
  html += '</ul>';
  html += `<br><p><strong>Total Mesin:</strong> ${machines.length}</p>`;
  html += `<p><strong>Level Tertinggi:</strong> ${maxLevelEl.innerText}</p>`;

  checkoutDetails.innerHTML = html;
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Kirim hasil Checkout ke WhatsApp 087888307856
btnConfirmWa.addEventListener('click', () => {
  let text = 'Halo, berikut rincian pesanan/cekout mesin saya:\n\n';
  machines.forEach(m => {
    text += `- ${m.name} (Level ${m.level})\n`;
  });
  text += `\nTotal Mesin: ${machines.length}`;
  text += `\nLevel Tertinggi: ${maxLevelEl.innerText}`;

  const waUrl = `https://wa.me/6287888307856?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
});
