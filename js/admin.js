document.addEventListener("DOMContentLoaded", function () {
    loadDaftarAdmin();

    document.getElementById("form-tambah").addEventListener("submit", function (e) {
        e.preventDefault();

        const itemBaru = {
            id: Date.now(),
            nama: document.getElementById("nama").value.trim(),
            kategori: document.getElementById("kategori").value.trim(),
            jenis: document.getElementById("jenis").value,
            level: parseInt(document.getElementById("level").value),
            harga: parseInt(document.getElementById("harga").value),
            gambar: document.getElementById("gambar").value.trim()
        };

        let produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
        produkList.push(itemBaru);
        localStorage.setItem("hayday_products", JSON.stringify(produkList));

        this.reset();
        loadDaftarAdmin();
        alert("Item berhasil ditambahkan!");
    });
});

function loadDaftarAdmin() {
    const wrapper = document.getElementById("admin-list-produk");
    const produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
    
    document.getElementById("total-item").innerText = produkList.length;
    wrapper.innerHTML = "";

    if (produkList.length === 0) {
        wrapper.innerHTML = `<p class="text-center text-[10px] font-bold text-[#725e42] py-4">Belum ada data tersimpan.</p>`;
        return;
    }

    produkList.forEach(item => {
        wrapper.innerHTML += `
            <div class="bg-white p-2 rounded-xl border border-[#ded7b8] flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <img src="${item.gambar}" class="w-10 h-10 object-cover rounded-lg border border-[#ded7b8]">
                    <div>
                        <h4 class="font-black text-[#5c4a38] text-[11px]">${item.nama}</h4>
                        <p class="text-[9px] text-[#725e42] font-bold">${item.kategori} · Lvl ${item.level} · Rp ${item.harga.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <button onclick="hapusSatuData(${item.id})" class="text-red-500 hover:text-red-700 p-1">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        `;
    });
}

function hapusSatuData(id) {
    if (confirm("Hapus item ini?")) {
        let produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
        produkList = produkList.filter(item => item.id !== id);
        localStorage.setItem("hayday_products", JSON.stringify(produkList));
        loadDaftarAdmin();
    }
}

function hapusSemuaData() {
    if (confirm("Yakin ingin menghapus SEMUA data produk?")) {
        localStorage.removeItem("hayday_products");
        loadDaftarAdmin();
    }
}
