/* dashboard.js - logika khusus halaman dashboard.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Dashboard ===== */
function sapaan(jam) { return jam < 11 ? "pagi" : jam < 15 ? "siang" : jam < 18 ? "sore" : "malam"; }
function initDashboard() {
  $("#peran").textContent = sessionStorage.getItem("role");
  const tampil = () => {
    const now = new Date();
    $("#salam").textContent = "Selamat " + sapaan(now.getHours()) + ", " + sessionStorage.getItem("user");
    $("#jam").textContent = now.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
  };
  tampil(); setInterval(tampil, 30000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!jagaHalaman()) return;
  initDashboard();
});
