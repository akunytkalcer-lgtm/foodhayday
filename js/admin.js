document.addEventListener("DOMContentLoaded", function () {
    loadDaftarAdmin();

    // HANDLER BANNER TOKO
    const formBanner = document.getElementById("form-banner");
    if (formBanner) {
        formBanner.addEventListener("submit", async function (e) {
            e.preventDefault();
            const btn = document.getElementById("btn-banner");
            const file = document.getElementById("banner-file").files[0];
            if (!file) return;

            btn.innerText = "Memproses...";
            btn.disabled = true;

            try {
                const bannerBase64 = await kompresGambar(file, 600, 0.7);
                localStorage.setItem("hayday_banner", bannerBase64);
                alert("Banner toko berhasil diperbarui!");
                this.reset();
            } catch (error) {
                alert("Gagal mengolah foto banner!");
            } finally {
                btn.innerHTML = '<i class="fa-solid fa-image mr-1"></i> Simpan Banner Toko';
                btn.disabled = false;
            }
        });
    }

    // HANDLER TAMBAH PRODUK
    const formTambah = document.getElementById("form-tambah");
    if (formTambah) {
        formTambah.addEventListener("submit", async function (e) {
            e.preventDefault();
            const btn = document.getElementById("btn-simpan");
            const fileInput = document.getElementById("gambar-file");
            const file = fileInput.files[0];

            if (!file) {
                alert("Pilih foto terlebih dahulu!");
                return;
            }

            btn.innerText = "Menyimpan...";
            btn.disabled = true;

            try {
                // Kompres foto produk ke max lebar 300px biar ringan banget
                const gambarBase64 = await kompresGambar(file, 300, 0.7);

                const itemBaru = {
                    id: Date.now(),
                    nama: document.getElementById("nama").value.trim(),
                    kategori: document.getElementById("kategori").value.trim(),
                    jenis: document.getElementById("jenis").value.trim().toLowerCase(),
                    level: parseInt(document.getElementById("level").value),
                    harga: parseInt(document.getElementById("harga").value),
                    gambar: gambarBase64
                };

                let produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
                produkList.push(itemBaru);

                localStorage.setItem("hayday_products", JSON.stringify(produkList));
                this.reset();
                loadDaftarAdmin();
                alert("Item berhasil ditambahkan!");
            } catch (error) {
                alert("Penyimpanan browser penuh atau file bermasalah!");
                console.error(error);
            } finally {
                btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Simpan Item';
                btn.disabled = false;
            }
        });
    }
});

// FUNGSI UNTUK MERESIZE & KOMPRES GAMBAR OTOMATIS
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

                // Export ke Base64 JPG ringan
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
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
                        <p class="text-[9px] text-[#725e42] font-bold">${item.kategori} (${item.jenis}) · Lvl ${item.level} · Rp ${item.harga.toLocaleString('id-ID')}</p>
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
