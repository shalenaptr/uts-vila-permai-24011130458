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

// --- 5. DROPDOWN Pilihan Villa ---
function populateVillaDropdown() {
  try {
    if (!villaSelect) return;

    // Kosongkan dulu
    villaSelect.innerHTML = '<option value="">-- Pilih Villa --</option>';

    villaData.forEach(villa => {
      const option = document.createElement('option');
      option.value = villa.id;
      option.textContent = `${villa.nama} - ${villa.tipeKamar}`;
      villaSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Gagal mengisi dropdown:', error);
  }
}
// --- 6. PENCARIAN / FILTER ---
function performSearch(query) {
  try {
    if (!villaListElement) return;

    const searchQuery = query.trim().toLowerCase();

    // Filter data
    const filtered = villaData.filter(villa => {
      return (
        villa.nama.toLowerCase().includes(searchQuery) ||
        villa.lokasi.toLowerCase().includes(searchQuery) ||
        villa.tipeKamar.toLowerCase().includes(searchQuery)
      );
    });

    clearVillaList();

    if (filtered.length === 0) {
      showEmptyState();
      return;
    }

    if (villaEmptyElement) {
      villaEmptyElement.style.display = 'none';
    }

    filtered.forEach((villa, index) => {
      createVillaCard(villa, index);
    });
  } catch (error) {
    console.error('Gagal melakukan pencarian:', error);
    showError('Terjadi kesalahan saat mencari villa.');
  }
}
// --- 7. EVENT LISTENERS ---
function setupEventListeners() {
  try {
    // Filter button
    if (filterBtn && searchInput) {
      filterBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
          performSearch(query);
        }
      });
    }

    // Search input (Enter key)
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            performSearch(query);
          }
        }
      });
    }

    // Form submit
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Auto-update jumlah malam dari tanggal
    [checkInInput, checkOutInput].forEach((field) => {
      if (!field) return;

      field.addEventListener('input', updateNightsInput);
      field.addEventListener('change', updateNightsInput);
    });

    if (nightsInput) {
      nightsInput.addEventListener('input', () => {
        const value = parseInt(nightsInput.value, 10);
        if (!Number.isNaN(value) && value > 0) {
          nightsInput.value = value;
        }
      });
    }

    // Highlight invalid fields immediately when user edits them
    [guestNameInput, guestCountInput, checkInInput, checkOutInput, villaSelect].forEach((field) => {
      if (!field) return;

      field.addEventListener('input', () => {
        setFieldValidationState(field, false);
      });

      field.addEventListener('change', () => {
        setFieldValidationState(field, false);
      });
    });

    // Booking buttons
    const checkBtn = document.getElementById('checkAvailabilityBtn');
    const orderBtn = document.getElementById('orderBtn');

    if (checkBtn) {
      checkBtn.addEventListener('click', handleCheckAvailability);
    }

    if (orderBtn) {
      // "Pesan Sekarang" juga memicu submit
      orderBtn.addEventListener('click', () => {
        form.requestSubmit();
      });
    }
  } catch (error) {
    console.error('Gagal menyiapkan event listeners:', error);
  }
}

function updateNightsInput() {
  if (!nightsInput || !checkInInput || !checkOutInput) {
    return;
  }

  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;

  if (!checkIn || !checkOut) {
    nightsInput.value = 1;
    return;
  }

  const nights = getNights(checkIn, checkOut);
  nightsInput.value = nights;
}

function setFieldValidationState(field, isInvalid) {
  if (!field) return;
  field.classList.toggle('is-invalid', isInvalid);
}

function resetValidationState() {
  [guestNameInput, guestCountInput, checkInInput, checkOutInput, villaSelect].forEach((field) => {
    setFieldValidationState(field, false);
  });
}
// --- 8. VALIDASI FORM (Indonesian) ---
function validasiForm() {
  const errors = {};
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  resetValidationState();

  // Reset errors
  document.getElementById('nameError').textContent = '';
  document.getElementById('countError').textContent = '';
  document.getElementById('checkInError').textContent = '';
  document.getElementById('checkOutError').textContent = '';
  document.getElementById('villaError').textContent = '';

  // Nama
  const name = guestNameInput ? guestNameInput.value.trim() : '';
  if (!name) {
    errors.name = 'Nama tamu wajib diisi.';
    setFieldValidationState(guestNameInput, true);
    showError('Nama tamu wajib diisi.');
    return false;
  }

  // Jumlah tamu
  const countValue = guestCountInput ? guestCountInput.value.trim() : '';
  const count = countValue ? parseInt(countValue, 10) : NaN;
  if (!countValue || isNaN(count) || count < 1 || count > 10) {
    errors.count = 'Jumlah tamu harus antara 1 sampai 10.';
    setFieldValidationState(guestCountInput, true);
    showError('Jumlah tamu harus antara 1 sampai 10.');
    return false;
  }

  // Check-in
  const checkIn = checkInInput ? checkInInput.value : '';
  if (!checkIn) {
    errors.checkIn = 'Tanggal check-in wajib diisi.';
    setFieldValidationState(checkInInput, true);
    showError('Tanggal check-in wajib diisi.');
    return false;
  }

  if (checkIn < today) {
    errors.checkIn = 'Tanggal check-in tidak boleh di masa lalu.';
    setFieldValidationState(checkInInput, true);
    showError('Tanggal check-in tidak boleh di masa lalu.');
    return false;
  }

  // Check-out
  const checkOut = checkOutInput ? checkOutInput.value : '';
  if (!checkOut) {
    errors.checkOut = 'Tanggal check-out wajib diisi.';
    setFieldValidationState(checkOutInput, true);
    showError('Tanggal check-out wajib diisi.');
    return false;
  }

  if (checkOut <= checkIn) {
    errors.checkOut = 'Tanggal check-out harus setelah tanggal check-in.';
    setFieldValidationState(checkOutInput, true);
    showError('Tanggal check-out harus setelah tanggal check-in.');
    return false;
  }

  // Villa
  const villaId = villaSelect ? parseInt(villaSelect.value, 10) : NaN;
  if (isNaN(villaId) || villaId <= 0) {
    errors.villa = 'Pilih unit vila terlebih dahulu.';
    setFieldValidationState(villaSelect, true);
    showError('Pilih unit vila terlebih dahulu.');
    return false;
  }

  return !Object.values(errors).some((message) => Boolean(message));
}

function showError(message) {
  if (resultArea) {
    resultArea.className = 'result-area';
    resultArea.innerHTML = `
      <div class="result-message result-message--error">
        <strong>Perhatian:</strong> ${message}
      </div>
    `;
  }

  if (orderSuccess) {
    orderSuccess.textContent = '';
    orderSuccess.classList.remove('order-success--visible');
  }
}

function handleCheckAvailability() {
  try {
    const villaId = villaSelect ? parseInt(villaSelect.value, 10) : NaN;
    if (isNaN(villaId) || villaId <= 0) {
      showError('Pilih unit villa terlebih dahulu.');
      return;
    }

    const villa = villaData.find(item => item.id === villaId);
    if (!villa) {
      showError('Villa yang dipilih tidak ditemukan.');
      return;
    }

    const checkIn = checkInInput ? checkInInput.value : '';
    const checkOut = checkOutInput ? checkOutInput.value : '';
    if (!checkIn || !checkOut) {
      showError('Isi tanggal check-in dan check-out terlebih dahulu.');
      return;
    }

    const nightsFromInput = nightsInput ? parseInt(nightsInput.value, 10) : NaN;
    const nights = Number.isFinite(nightsFromInput) && nightsFromInput > 0
      ? nightsFromInput
      : getNights(checkIn, checkOut);
    const total = hitungTotalHarga(villa, nights);

    if (resultArea) {
      resultArea.className = 'result-area';
      resultArea.innerHTML = `
        <div class="result-summary">
          <div class="result-summary__header">
            <span class="result-summary__badge result-summary__badge--${villa.status === 'available' ? 'available' : 'booked'}">
              ${villa.status === 'available' ? 'Tersedia' : 'Habis Datang'}
            </span>
            <h3>Ketersediaan</h3>
          </div>
          <div class="result-summary__grid">
            <div class="result-summary__item"><span>Villa</span><strong>${villa.nama}</strong></div>
            <div class="result-summary__item"><span>Status</span><strong>${villa.status === 'available' ? 'Tersedia' : 'Habis Datang'}</strong></div>
            <div class="result-summary__item"><span>Check-in</span><strong>${formatDate(checkIn)}</strong></div>
            <div class="result-summary__item"><span>Check-out</span><strong>${formatDate(checkOut)}</strong></div>
            <div class="result-summary__item"><span>Jumlah Malam</span><strong>${nights}</strong></div>
            <div class="result-summary__item result-summary__item--wide"><span>Estimasi Total</span><strong>Rp ${formatNumber(total)}</strong></div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Gagal mengecek ketersediaan:', error);
    showError('Gagal mengecek ketersediaan villa. Silakan coba lagi.');
  }
}
// --- 9. PERHITUNGAN HARGA ---
function hitungTotalHarga(villa, nights) {
  try {
    if (!villa || !Number.isFinite(villa.hargaPerMalam) || !Number.isFinite(nights) || nights <= 0) {
      return null;
    }

    return villa.hargaPerMalam * nights;
  } catch (error) {
    console.error('Gagal menghitung total:', error);
    return null;
  }
}
// --- 10. HANDLER FORM ---
function handleFormSubmit(e) {
  e.preventDefault();

  try {
    if (!validasiForm()) {
      return;
    }

    const name = guestNameInput.value.trim();
    const count = parseInt(guestCountInput.value, 10);
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const villaId = parseInt(villaSelect.value, 10);

    const villa = villaData.find(item => item.id === villaId);

    if (!villa) {
      showError('Villa yang dipilih tidak ditemukan.');
      return;
    }

    if (villa.status !== 'available') {
      showError('Maaf, villa ini sedang tidak tersedia.');
      return;
    }

    const nights = getNights(checkIn, checkOut);
    const total = hitungTotalHarga(villa, nights);

    if (total === null) {
      showError('Gagal menghitung total harga.');
      return;
    }

    const order = {
      id: Date.now(),
      namaTamu: name,
      jumlahTamu: count,
      namaVilla: villa.nama,
      villaId: villa.id,
      checkIn: checkIn,
      checkOut: checkOut,
      jumlahMalam: nights,
      totalHarga: total,
      tanggalPesan: new Date().toISOString()
    };

    orders.push(order);
    saveOrdersToStorage();

    if (orderSuccess) {
      orderSuccess.textContent = `Pemesanan berhasil! Terima kasih, ${name}.`;
      orderSuccess.classList.add('order-success--visible');
    }

    if (resultArea) {
      resultArea.className = 'result-area';
      resultArea.innerHTML = `
        <div class="result-message result-message--success">
          <strong>Pemesanan Berhasil!</strong>
          <p>Villa ${villa.nama} berhasil dipesan.</p>
          <p>Total pembayaran: <strong>Rp ${formatNumber(total)}</strong></p>
          <p>Jumlah malam: ${nights}</p>
        </div>
      `;
    }

    form.reset();
    updateNightsInput();
    resetValidationState();

    console.log('Pemesanan berhasil:', order);
  } catch (error) {
    console.error('Gagal memproses pemesanan:', error);
    showError('Terjadi kesalahan saat memproses pemesanan.');
  }
}
// --- 11. GET NIGHTS ---
function getNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.ceil(diff));
}
// --- 12. FORMAT NUMBER ---
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}
// --- 12. FORMAT NUMBER ---
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}
// --- 13. FORMAT DATE ---
function formatDate(dateStr) {
  // Format YYYY-MM-DD -> DD MMM YYYY
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sept', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
// --- 14. LOCAL STORAGE ---
function saveOrdersToStorage() {
  try {
    localStorage.setItem('villaOrders', JSON.stringify(orders));
  } catch (error) {
    console.error('Gagal menyimpan orders:', error);
  }
}

function loadOrdersFromStorage() {
  try {
    const stored = localStorage.getItem('villaOrders');
    if (stored) {
      orders = JSON.parse(stored);
      console.log(`Loaded ${orders.length} saved orders from localStorage.`);
    }
  } catch (error) {
    console.error('Gagal memuat orders dari localStorage:', error);
    orders = [];
  }
}

function getLastGuest() {
  try {
    return localStorage.getItem('lastGuestName') || '';
  } catch (error) {
    console.error('Gagal mengambil lastGuestName:', error);
    return '';
  }
}