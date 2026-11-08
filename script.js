// --- 1. DATA (array objek) ---
const villaData = [
  {
    id: 1,
    nama: 'Villa Melati',
    tipeKamar: 'Deluxe Villa',
    lokasi: 'Ubud, Bali',
    hargaPerMalam: 5500000,
    fasilitas: ['Private Pool', 'AC', 'Kamar Mandi Depan', 'Pantry', 'WiFi'],
    status: 'available',
    deskripsi: 'Villa mewah dengan kolam renang pribadi dan pemandian penyembuh.'
  },
  {
    id: 2,
    nama: 'Villa Mawar',
    tipeKamar: 'Premium Villa',
    lokasi: 'Nusa Dua, Bali',
    hargaPerMalam: 7200000,
    fasilitas: ['Jacuzzi', 'AC', 'Kitchen Matic', 'Garden', 'WiFi', 'TV Ubi'],
    status: 'available',
    deskripsi: 'VillaPremium dengan jacuzzi terpisah dan area taman luas.'
  },
  {
    id: 3,
    nama: 'Villa Anggrek',
    tipeKamar: 'Superior Villa',
    lokasi: 'Jimbaran, Bali',
    hargaPerMalam: 6300000,
    fasilitas: ['Private Pool', 'AC', 'Garden View', 'Kitchen', 'WiFi', 'Box Pembersih Udara'],
    status: 'booked',
    deskripsi: 'Villa unggulan dengan kolam renang luas dan pemandangan pantai.'
  }
];

// --- 2. STATE ---
let villaListElement = null;
let villaEmptyElement = null;
let searchInput = null;
let filterBtn = null;
let villaSelect = null;
let checkInInput = null;
let checkOutInput = null;
let nightsInput = null;
let guestCountInput = null;
let guestNameInput = null;
let form = null;
let resultArea = null;
let orderSuccess = null;
let orders = [];

// --- 3. INITIALISASI HALAMAN ---
function initPage() {
  try {
    // Cari elemen
    villaListElement = document.getElementById('villaList');
    villaEmptyElement = document.getElementById('villaEmpty');
    searchInput = document.getElementById('searchInput');
    filterBtn = document.getElementById('filterBtn');
    villaSelect = document.getElementById('villaSelect');
    checkInInput = document.getElementById('checkIn');
    checkOutInput = document.getElementById('checkOut');
    nightsInput = document.getElementById('nightsInput');
    guestCountInput = document.getElementById('guestCount');
    guestNameInput = document.getElementById('guestName');
    form = document.getElementById('bookingForm');
    resultArea = document.getElementById('resultArea');
    orderSuccess = document.getElementById('orderSuccess');

    if (!villaListElement || !villaSelect) {
      throw new Error('Elemen utama halaman tidak ditemukan.');
    }

    // Render awal
    renderVillas();
    populateVillaDropdown();

    // Load orders dari localStorage
    loadOrdersFromStorage();

    // Event listeners
    setupEventListeners();
    updateNightsInput();

    // Lakukan pencarian pada awal (localStorage) - hanya jika ada
    const savedSearch = localStorage.getItem('villaSearchQuery');
    if (savedSearch) {
      searchInput.value = savedSearch;
      performSearch(savedSearch);
    }

    console.log('Halaman Villa Permai berhasil dimuat.');
  } catch (error) {
    console.error('Gagal inisialisasi:', error);
    showError('Tidak dapat memuat data vila. Silakan muat ulang halaman.');
  }
}

// --- 4. RENDER VILLA (createElement + appendChild) ---
function renderVillas() {
  try {
    clearVillaList();

    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = villaData.filter(villa => {
      if (!searchQuery) return true;
      return (
        villa.nama.toLowerCase().includes(searchQuery) ||
        villa.lokasi.toLowerCase().includes(searchQuery) ||
        villa.tipeKamar.toLowerCase().includes(searchQuery)
      );
    });

    if (filtered.length === 0) {
      showEmptyState();
      return;
    }

    filtered.forEach((villa, index) => {
      createVillaCard(villa, index);
    });

    // Simpan last search
    if (searchInput) {
      localStorage.setItem('villaSearchQuery', searchInput.value);
    }
  } catch (error) {
    console.error('Gagal merender villa:', error);
    showError('Gagal menampilkan daftar villa.');
  }
}

function createVillaCard(villa, index) {
  try {
    // Buat elemen card
    const article = document.createElement('article');
    article.className = 'villa-card';
    article.dataset.villaId = villa.id;

    // Header (title + status badge)
    const header = document.createElement('div');
    header.className = 'villa-card__header';

    const title = document.createElement('h3');
    title.className = 'villa-card__title';
    title.textContent = villa.nama;

    const statusBadge = document.createElement('span');
    statusBadge.className = `villa-card__status villa-card__status--${villa.status}`;
    statusBadge.textContent = villa.status === 'available' ? 'Tersedia' : 'Habis Datang';

    header.appendChild(title);
    header.appendChild(statusBadge);
    article.appendChild(header);

    // Body details
    const body = document.createElement('div');
    body.className = 'villa-card__body';

    const details = document.createElement('div');
    details.className = 'villa-card__details';

    const lokasiItem = document.createElement('div');
    lokasiItem.className = 'villa-card__detail-item';
    lokasiItem.innerHTML = `<strong>Lokasi</strong><p>${villa.lokasi}</p>`;
    details.appendChild(lokasiItem);

    const tipeItem = document.createElement('div');
    tipeItem.className = 'villa-card__detail-item';
    tipeItem.innerHTML = `<strong>Tipe Kamar</strong><p>${villa.tipeKamar}</p>`;
    details.appendChild(tipeItem);

    body.appendChild(details);

    // Facilities
    const facilitiesList = document.createElement('div');
    facilitiesList.className = 'villa-card__facilities';

    villa.fasilitas.forEach(fac => {
      const tag = document.createElement('span');
      tag.className = 'villa-card__facility-tag';
      tag.textContent = fac;
      facilitiesList.appendChild(tag);
    });

    body.appendChild(facilitiesList);

    // Price
    const priceContainer = document.createElement('div');
    priceContainer.className = 'villa-card__price';

    const priceValue = document.createElement('span');
    priceValue.className = 'villa-card__price-value';
    priceValue.textContent = `Rp ${formatNumber(villa.hargaPerMalam)} / malam`;

    priceContainer.appendChild(priceValue);
    body.appendChild(priceContainer);

    article.appendChild(body);

    // Append to container
    if (villaListElement) {
      villaListElement.appendChild(article);
    }
  } catch (error) {
    console.error(`Gagal membuat kartu untuk "${villa.nama}":`, error);
  }
}

function clearVillaList() {
  if (villaListElement) {
    villaListElement.innerHTML = '';
  }
}

function showEmptyState() {
  if (villaEmptyElement) {
    villaEmptyElement.style.display = 'block';
  }
  if (villaListElement) {
    villaListElement.innerHTML = '';
  }
}