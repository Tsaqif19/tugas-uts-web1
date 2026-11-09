/* stok.js - logika khusus halaman stok.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Stok / Katalog ===== */
function buatBaris(b, baru) {
  const tr = document.createElement("tr");
  if (baru) tr.className = "baris-baru";
  tr.innerHTML = `<td><img class="sampul" src="${esc(b.gambar)}" alt="Cover ${esc(b.judul)}"></td><td>${esc(b.kode)}</td>` +
    `<td><strong>${esc(b.judul)}</strong></td><td>${esc(b.jenis)}</td><td class="angka">${esc(b.edisi)}</td>` +
    `<td class="angka">${b.stok}</td><td class="angka">${rupiah(b.harga)}</td>`;
  return tr;
}
function ringkasStok() {
  const k = getKatalog();
  $("#jmlJudul").textContent = k.length;
  $("#jmlStok").textContent = k.reduce((a, b) => a + b.stok, 0).toLocaleString("id-ID");
  $("#jmlHabis").textContent = k.filter(b => b.stok < 100).length;
}
function initStok() {
  const tbody = $("#isiStok");
  getKatalog().forEach(b => tbody.appendChild(buatBaris(b)));
  ringkasStok();
  $("#formStok").addEventListener("submit", e => {
    e.preventDefault();
    const f = id => $("#" + id), bulat = v => v !== "" && Number.isInteger(Number(v));
    const kodeAda = getKatalog().some(b => b.kode.toLowerCase() === f("kode").value.trim().toLowerCase());
    const hasil = [
      setError(f("kode"), !f("kode").value.trim() ? "Kode wajib diisi." : kodeAda ? "Kode sudah dipakai." : ""),
      setError(f("nama"), f("nama").value.trim().length < 3 ? "Nama buku minimal 3 karakter." : ""),
      setError(f("jenis"), !f("jenis").value ? "Pilih jenis buku." : ""),
      setError(f("edisi"), !bulat(f("edisi").value) || Number(f("edisi").value) < 1 ? "Edisi harus bilangan bulat 1 atau lebih." : ""),
      setError(f("stok"), !bulat(f("stok").value) || Number(f("stok").value) < 0 ? "Stok harus bilangan bulat 0 atau lebih." : ""),
      setError(f("harga"), !(Number(f("harga").value) > 0) ? "Harga harus lebih dari 0." : "")
    ];
    if (hasil.includes(false)) return;
    // disimpan dengan format field yang sama seperti dataKatalogBuku
    const mentah = { kodeBarang: f("kode").value.trim().toUpperCase(), namaBarang: f("nama").value.trim(), jenisBarang: f("jenis").value, edisi: f("edisi").value, stok: Number(f("stok").value), harga: rupiah(f("harga").value), cover: "assets/logo.png" };
    const tambahan = ambil("stokBaru"); tambahan.push(mentah); simpan("stokBaru", tambahan);
    tbody.appendChild(buatBaris({ kode: mentah.kodeBarang, judul: mentah.namaBarang, jenis: mentah.jenisBarang, edisi: mentah.edisi, stok: mentah.stok, harga: angka(mentah.harga), gambar: mentah.cover }, true));
    ringkasStok();
    $("#infoStok").textContent = "Buku \"" + mentah.namaBarang + "\" ditambahkan ke stok.";
    e.target.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initStok();
});
