/* tracking.js - logika khusus halaman tracking.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Tracking ===== */
const tahapStatus = ["Diproses", "Dikirim", "Dalam Perjalanan", "Diterima"];
function cariPengiriman(no) {
  if (dataTracking[no]) return dataTracking[no];
  const r = ambil("riwayat").find(o => o.noDO === no);
  if (!r) return null;
  return { nomorDO: r.noDO, nama: r.nama, status: "Diproses", ekspedisi: r.ekspedisi, tanggalKirim: r.tanggal, paket: "Paket Buku", total: rupiah(r.total),
    perjalanan: [{ waktu: r.tanggal, keterangan: "Pesanan dibuat dan menunggu diproses oleh gudang" }] };
}
function initTracking() {
  const form = $("#formCari"), input = $("#noDO"), hasil = $("#hasil");
  function cari() {
    const no = input.value.trim();
    hasil.innerHTML = "";
    if (!setError(input, !no ? "Nomor Delivery Order wajib diisi." : "")) return;
    const d = cariPengiriman(no);
    if (!d) { setError(input, "Nomor tidak ditemukan. Coba 20230012 atau 20230013."); alert("Nomor Delivery Order " + no + " tidak ditemukan."); return; }
    const idx = Math.max(0, tahapStatus.indexOf(d.status)) + 1;
    const langkah = tahapStatus.map((t, i) => `<li class="${i + 1 < idx ? "selesai" : i + 1 === idx ? "selesai aktif" : ""}">${t}</li>`).join("");
    const waktu = d.perjalanan.map(p => `<li><time>${esc(rapikanWaktu(p.waktu))}</time>${esc(p.keterangan)}</li>`).join("");
    hasil.innerHTML = `<section class="panel" aria-live="polite"><h2>Pesanan ${esc(d.nomorDO)}</h2><p>Pemesan: <strong>${esc(d.nama)}</strong></p>` +
      `<h3>Status pengiriman: ${esc(d.status)}</h3><ol class="progres" aria-label="Tahap pengiriman">${langkah}</ol>` +
      `<dl class="detail"><dt>Ekspedisi</dt><dd>${esc(d.ekspedisi)}</dd><dt>Tanggal kirim</dt><dd>${esc(d.tanggalKirim)}</dd><dt>Jenis paket</dt><dd>${esc(d.paket)}</dd><dt>Total pembayaran</dt><dd>${esc(d.total)}</dd></dl>` +
      `<h3 style="margin-top:24px">Riwayat perjalanan</h3><ul class="garis-waktu">${waktu}</ul></section>`;
  }
  form.addEventListener("submit", e => { e.preventDefault(); cari(); });
  const q = new URLSearchParams(location.search).get("do");
  if (q) { input.value = q; cari(); }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initTracking();
});
