/* history.js - logika khusus halaman history.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== History Transaksi ===== */
function initRiwayat() {
  const data = getPesanan().slice().reverse(), tbody = $("#isiRiwayat");
  $("#kosongRiwayat").hidden = data.length > 0;
  data.forEach(o => {
    const tr = document.createElement("tr");
    const buku = o.items.length ? o.items.map(i => esc(i.judul) + " x" + i.qty).join("<br>") : "-";
    tr.innerHTML = `<td>${esc(o.noDO)}</td><td>${esc(o.tanggal)}</td><td>${esc(o.nama)}</td><td>${buku}</td>` +
      `<td>${esc(o.metode)}</td><td class="angka">${rupiah(o.total)}</td><td><a href="tracking.html?do=${encodeURIComponent(o.noDO)}">Lacak</a></td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initRiwayat();
});
