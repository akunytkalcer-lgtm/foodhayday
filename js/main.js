document.addEventListener("DOMContentLoaded", function () {
    loadBannerToko();
    renderKatalog();

    // Event Listener Filter Search
    document.getElementById("search-input").addEventListener("input", renderKatalog);
    document.getElementById("select-level").addEventListener("change", renderKatalog);
    
    // Event Listener Reset
    document.getElementById("btn-reset").addEventListener("click", function() {
        document.getElementById("search-input").value = "";
        document.getElementById("select-level").value = "";
        window.currentKategori = "Semua";
        window.isMachineOnly = false;
        renderKatalog();
    });

    // Event Listener Tombol Machine
    document.getElementById("btn-machine").addEventListener("click", function() {
        window.isMachineOnly = !window.isMachineOnly;
        this.classList.toggle("active-kat");
        renderKatalog();
    });
});

// 1. TAMPILKAN BANNER TOKO
function loadBannerToko() {
    const bannerData = localStorage.getItem("hayday_banner");
    const imgElement = document.getElementById("gambar-toko");
    if (bannerData && imgElement) {
        imgElement.src = bannerData;
    }
}

// 2. RENDER DAFTAR PRODUK & KATEGORI
window.currentKategori = "Semua";
window.isMachineOnly = false;

function renderKatalog() {
    const produkList = JSON.parse(localStorage.getItem("hayday_products")) || [];
    const wrapper = document.getElementById("produk-wrapper");
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const levelVal = document.getElementById("select-level").value;

    // Render Tombol Kategori Dinamis
    renderTombolKategori(produkList);

    // Filtering Data
    let filtered = produkList.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(searchVal) || 
                            (item.mesin && item.mesin.toLowerCase().includes(searchVal));
        
        const matchKategori = (window.currentKategori === "Semua") || (item.kategori === window.currentKategori);
        
        let matchLevel = true;
        if (levelVal === "1-10") matchLevel = item.level >= 1 && item.level <= 10;
        else if (levelVal === "11-30") matchLevel = item.level >= 11 && item.level <= 30;
        else if (levelVal === "31-50") matchLevel = item.level >= 31 && item.level <= 50;
        else if (levelVal === "51+") matchLevel = item.level >= 51;

        let matchMachine = true;
        if (window.isMachineOnly) {
            matchMachine = item.jenis === "machine" || (item.mesin && item.mesin.toLowerCase().includes("mesin"));
        }

        return matchSearch && matchKategori && matchLevel && matchMachine;
    });

    // Update Counter Total
    const totalFood = filtered.filter(i => i.jenis !== "machine").length;
    const totalMesin = filtered.filter(i => i.jenis === "machine").length;
    document.getElementById("total-info").innerText = `${totalFood} food · ${totalMesin} mesin`;

    // Render ke HTML
    wrapper.innerHTML = "";
    if (filtered.length === 0) {
        wrapper.innerHTML = `
            <div class="col-span-2 text-center py-8 bg-white rounded-2xl border border-[#ded7b8]">
                <p class="text-xs font-black text-[#725e42] uppercase">Produk Tidak Ditemukan</p>
            </div>`;
        return;
    }

    filtered.forEach(item => {
        wrapper.innerHTML += `
            <div class="bg-white rounded-2xl p-2.5 border-2 border-[#ded7b8] shadow-sm flex flex-col justify-between">
                <div class="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-[#f9f6ef] border border-[#ded7b8]">
                    <img src="${item.gambar}" alt="${item.nama}" class="w-full h-full object-cover">
                    <span class="absolute top-1 right-1 bg-[#ff9800] text-white font-black text-[8px] px-1.5 py-0.5 rounded-md uppercase">Lvl ${item.level}</span>
                </div>
                <div>
                    <h3 class="font-black text-[#5c4a38] text-xs leading-tight mb-0.5">${item.nama}</h3>
                    <p class="text-[9px] text-[#8c785c] font-bold">${item.kategori} ${item.mesin ? '· ' + item.mesin : ''}</p>
                </div>
                <div class="mt-2 pt-1 border-t border-[#f0ead8] flex justify-between items-center">
                    <span class="text-[10px] font-black text-[#4a8d42]">Rp ${item.harga.toLocaleString('id-ID')}</span>
                </div>
            </div>`;
    });
}

function renderTombolKategori(produkList) {
    const katWrapper = document.getElementById("kategori-wrapper");
    const kategoriSet = ["Semua", ...new Set(produkList.map(item => item.kategori).filter(Boolean))];

    katWrapper.innerHTML = kategoriSet.map(kat => `
        <button type="button" 
            onclick="selectKategori('${kat}')" 
            class="btn-kategori flex-none uppercase ${window.currentKategori === kat ? 'active-kat' : ''}">
            ${kat}
        </button>
    `).join("");
}

function selectKategori(kat) {
    window.currentKategori = kat;
    renderKatalog();
}
