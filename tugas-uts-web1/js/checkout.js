/* checkout.js - logika khusus halaman checkout.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Checkout ===== */
function initCheckout() {
  const katalog = getKatalog();
  let keranjang = ambil("keranjang");
  const pilih = $("#pilihBuku");
  katalog.forEach(b => {
    const o = document.createElement("option");
    o.value = b.kode; o.disabled = b.stok === 0;
    o.textContent = b.judul + " (" + rupiah(b.harga) + ")" + (b.stok === 0 ? " - habis" : "");
    pilih.appendChild(o);
  });

  function gambar() {
    const tbody = $("#isiKeranjang"); tbody.innerHTML = "";
    keranjang = keranjang.filter(i => katalog.some(b => b.kode === i.kode));
    $("#kosongKeranjang").hidden = keranjang.length > 0;
    keranjang.forEach(it => {
      const stok = katalog.find(b => b.kode === it.kode).stok;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${esc(it.judul)}</td><td class="angka">${rupiah(it.harga)}</td>` +
        `<td><label class="sr-only" for="q-${it.kode}">Jumlah ${esc(it.judul)}</label><input class="qty" id="q-${it.kode}" type="number" min="1" max="${stok}" value="${it.qty}"></td>` +
        `<td class="angka">${rupiah(it.harga * it.qty)}</td><td><button type="button" class="btn bahaya kecil" data-hapus="${it.kode}">Hapus</button></td>`;
      tbody.appendChild(tr);
    });
    $("#totalBayar").textContent = rupiah(keranjang.reduce((a, i) => a + i.harga * i.qty, 0));
    simpan("keranjang", keranjang);
  }

  $("#formTambah").addEventListener("submit", e => {
    e.preventDefault();
    const qty = $("#jumlah"), buku = katalog.find(b => b.kode === pilih.value);
    const ok1 = setError(pilih, !buku ? "Pilih buku terlebih dahulu." : "");
    const ok2 = setError(qty, !(Number(qty.value) >= 1) ? "Jumlah minimal 1." : buku && Number(qty.value) > buku.stok ? "Stok hanya " + buku.stok + "." : "");
    if (!ok1 || !ok2) return;
    const ada = keranjang.find(i => i.kode === buku.kode);
    if (ada) ada.qty = Math.min(buku.stok, ada.qty + Number(qty.value));
    else keranjang.push({ kode: buku.kode, judul: buku.judul, harga: buku.harga, qty: Number(qty.value) });
    gambar(); e.target.reset();
  });

  $("#isiKeranjang").addEventListener("change", e => {
    if (!e.target.classList.contains("qty")) return;
    const kode = e.target.id.slice(2), item = keranjang.find(i => i.kode === kode);
    const maks = Number(e.target.max), v = Number(e.target.value);
    if (!Number.isInteger(v) || v < 1 || v > maks) { alert("Jumlah harus antara 1 dan " + maks + "."); e.target.value = item.qty; return; }
    item.qty = v; gambar();
  });
  $("#isiKeranjang").addEventListener("click", e => {
    const kode = e.target.dataset.hapus; if (!kode) return;
    keranjang = keranjang.filter(i => i.kode !== kode); gambar();
  });

  $("#formPesan").addEventListener("submit", e => {
    e.preventDefault();
    if (keranjang.length === 0) { alert("Keranjang masih kosong. Tambahkan minimal satu buku."); return; }
    const f = id => $("#" + id);
    const hasil = [
      setError(f("nama"), f("nama").value.trim().length < 3 ? "Nama minimal 3 karakter." : ""),
      setError(f("telp"), !/^\d{9,14}$/.test(f("telp").value.trim()) ? "Nomor telepon 9-14 digit angka." : ""),
      setError(f("alamat"), f("alamat").value.trim().length < 10 ? "Alamat minimal 10 karakter." : ""),
      setError(f("ekspedisi"), !f("ekspedisi").value ? "Pilih ekspedisi." : ""),
      setError(f("metode"), !f("metode").value ? "Pilih metode pembayaran." : "")
    ];
    if (hasil.includes(false)) return;
    const total = keranjang.reduce((a, i) => a + i.harga * i.qty, 0);
    let noDO; do { noDO = "2026" + String(Math.floor(Math.random() * 10000)).padStart(4, "0"); } while (getPesanan().some(o => o.noDO === noDO));
    const order = { noDO, tanggal: new Date().toISOString().slice(0, 10), nama: f("nama").value.trim(), alamat: f("alamat").value.trim(), ekspedisi: f("ekspedisi").value, metode: f("metode").value, total, items: keranjang };
    const lama = ambil("riwayat"); lama.push(order); simpan("riwayat", lama);
    keranjang = []; gambar(); e.target.reset();
    $("#noDOBaru").textContent = noDO; $("#totalBaru").textContent = rupiah(total);
    $("#linkLacak").href = "tracking.html?do=" + noDO;
    $("#modalSukses").showModal();
  });
  $("#tutupSukses").addEventListener("click", () => $("#modalSukses").close());
  gambar();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initCheckout();
});
