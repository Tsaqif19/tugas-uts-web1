/* ===== script.js: fungsi bersama yang dipakai semua halaman ===== */
/* ===== Utilitas ===== */
const $ = (s, r = document) => r.querySelector(s);
const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");
const angka = teks => parseInt(String(teks).replace(/\D/g, ""), 10) || 0;   // "Rp 180.000" -> 180000
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ambil = (k, d = []) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const rapikanWaktu = w => String(w).replace(/^(\d{4}-\d{2})\s(\d{2})/, "$1-$2");   // menormalkan "2025-08 25" -> "2025-08-25"

/* ===== Adapter data (data.js memakai nama field sendiri) ===== */
const getUsers = () => dataPengguna.concat(ambil("users"));
const getKatalog = () => dataKatalogBuku.concat(ambil("stokBaru")).map(b => ({
  kode: b.kodeBarang, judul: b.namaBarang, jenis: b.jenisBarang, edisi: b.edisi,
  stok: Number(b.stok), harga: angka(b.harga), gambar: b.cover
}));
// Semua pesanan = data awal dari dataTracking + pesanan baru dari halaman Pemesanan
const getPesanan = () => Object.values(dataTracking).map(t => ({
  noDO: t.nomorDO, tanggal: t.tanggalKirim, nama: t.nama, ekspedisi: t.ekspedisi, metode: "-", total: angka(t.total), items: []
})).concat(ambil("riwayat"));

function setError(input, pesan) {
  input.classList.toggle("salah", Boolean(pesan));
  input.setAttribute("aria-invalid", pesan ? "true" : "false");
  const el = $("#err-" + input.id);
  if (el) el.textContent = pesan || "";
  return !pesan;
}
const emailValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ===== Proteksi halaman & logout ===== */
function jagaHalaman() {
  if (!sessionStorage.getItem("user")) { location.href = "login.html"; return false; }
  const keluar = $("#keluar");
  if (keluar) keluar.addEventListener("click", () => { sessionStorage.clear(); location.href = "login.html"; });
  return true;
}
