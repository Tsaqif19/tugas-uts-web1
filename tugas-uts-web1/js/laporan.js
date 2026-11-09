/* laporan.js - logika khusus halaman laporan.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Laporan & 7. Riwayat ===== */
function initLaporan() {
  const data = getPesanan(), eks = {}, buku = {};
  data.forEach(o => {
    eks[o.ekspedisi] = eks[o.ekspedisi] || { n: 0, nilai: 0 }; eks[o.ekspedisi].n++; eks[o.ekspedisi].nilai += o.total;
    o.items.forEach(i => { buku[i.judul] = buku[i.judul] || { qty: 0, nilai: 0 }; buku[i.judul].qty += i.qty; buku[i.judul].nilai += i.qty * i.harga; });
  });
  $("#jmlPesanan").textContent = data.length;
  $("#jmlPendapatan").textContent = rupiah(data.reduce((a, o) => a + o.total, 0));
  $("#nilaiStok").textContent = rupiah(getKatalog().reduce((a, b) => a + b.stok * b.harga, 0));
  const isi = (id, obj, kol) => {
    const tbody = $(id);
    Object.entries(obj).sort((a, b) => b[1].nilai - a[1].nilai).forEach(([k, v]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${esc(k)}</td><td class="angka">${v[kol]}</td><td class="angka">${rupiah(v.nilai)}</td>`;
      tbody.appendChild(tr);
    });
  };
  isi("#isiEkspedisi", eks, "n"); isi("#isiLaporan", buku, "qty");
  $("#kosongLaporan").hidden = Object.keys(buku).length > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initLaporan();
});
