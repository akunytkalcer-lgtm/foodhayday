document.addEventListener("DOMContentLoaded", function () {
    loadDaftarAdmin();
    updateAutoOptions();

    // HANDLER TAMBAH PRODUK
    const formTambah = document.getElementById("form-tambah");
    if (formTambah) {
        formTambah.addEventListener("submit", async function (e) {
            e.preventDefault();
            const btn = document.getElementById("btn-simpan");
            const fileInput = document.getElementById("gambar-file");
            const file = fileInput.files[0];

            if (!file) return alert("Pilih foto terlebih dahulu!");

            btn.innerText = "Menyimpan...";
            btn.disabled = true;

            try {
                const gambarBase64 = await kompresGambar(file, 300, 0.7);

                const itemBaru = {
                    id: Date.now(),
                    nama: document.getElementById("nama").value.trim(),
                    kategori: document.getElementById("kategori").value.trim(),
                    mesin: document.getElementById("mesin").value.trim(),
                    level: parseInt(document.getElementById("level").value),
                    harga: parseInt(document.getElementById("harga").value),
                    gambar: gambarBase64
                };

                let produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
                produkList.push(itemBaru);

                localStorage.setItem("hayday_products", JSON.stringify(produkList));
                this.reset();
                
                loadDaftarAdmin();
                updateAutoOptions(); // Perbarui daftar otomatis
                alert("Item berhasil ditambahkan!");
            } catch (error) {
                alert("Gagal menyimpan data!");
            } finally {
                btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Simpan Item';
                btn.disabled = false;
            }
        });
    }
});

// MEMPERBARUI OPTION OTOMATIS BERDASARKAN DATA YANG SUDAH PERNAH DIINPUT
function updateAutoOptions() {
    const produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
    
    const kategoriSet = [...new Set(produkList.map(item => item.kategori))];
    const mesinSet = [...new Set(produkList.map(item => item.mesin))];

    const datalistKat = document.getElementById("list-kategori");
    const datalistMesin = document.getElementById("list-mesin");

    if (datalistKat) {
        datalistKat.innerHTML = kategoriSet.map(k => `<option value="${k}">`).join("");
    }
    if (datalistMesin) {
        datalistMesin.innerHTML = mesinSet.map(m => `<option value="${m}">`).join("");
    }
}

function kompresGambar(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
        };
    });
}

function loadDaftarAdmin() {
    const wrapper = document.getElementById("admin-list-produk");
    if (!wrapper) return;

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
                        <p class="text-[9px] text-[#725e42] font-bold">${item.kategori} · ${item.mesin} · Lvl ${item.level}</p>
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
        updateAutoOptions();
    }
}
