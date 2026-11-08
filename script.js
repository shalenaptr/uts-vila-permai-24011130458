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