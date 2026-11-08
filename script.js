/**
 * Villa Permai — Script JavaScript
 * 
 * Mengelola data villa, render kartu, validasi form,
 * perhitungan harga, localStorage, dan error handling.
 */

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