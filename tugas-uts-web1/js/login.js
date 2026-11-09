/* login.js - logika khusus halaman login.html (memakai fungsi bersama dari script.js dan data dari data.js) */
/* ===== Login ===== */
function initLogin() {
  $("#formLogin").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#email"), pass = $("#password");
    const ok1 = setError(email, !email.value.trim() ? "Email wajib diisi." : !emailValid(email.value.trim()) ? "Format email belum benar." : "");
    const ok2 = setError(pass, !pass.value ? "Password wajib diisi." : "");
    if (!ok1 || !ok2) return;
    const user = getUsers().find(u => u.email === email.value.trim().toLowerCase() && u.password === pass.value);
    if (!user) { alert("Email/password yang anda masukkan salah."); return; }
    sessionStorage.setItem("user", user.nama);
    sessionStorage.setItem("role", user.role || "User");
    location.href = "dashboard.html";
  });

  $("#btnLupa").addEventListener("click", () => $("#modalLupa").showModal());
  $("#btnDaftar").addEventListener("click", () => $("#modalDaftar").showModal());
  document.querySelectorAll("[data-tutup]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));

  $("#formLupa").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#emailLupa");
    if (!setError(em, !emailValid(em.value.trim()) ? "Masukkan email yang valid." : "")) return;
    alert("Jika email terdaftar, tautan reset password sudah dikirim ke " + em.value.trim() + ".");
    e.target.reset(); $("#modalLupa").close();
  });

  $("#formDaftar").addEventListener("submit", e => {
    e.preventDefault();
    const n = $("#namaDaftar"), em = $("#emailDaftar"), p = $("#passDaftar"), k = $("#passKonfirm");
    const sudah = getUsers().some(u => u.email === em.value.trim().toLowerCase());
    const hasil = [
      setError(n, n.value.trim().length < 3 ? "Nama minimal 3 karakter." : ""),
      setError(em, !emailValid(em.value.trim()) ? "Format email belum benar." : sudah ? "Email ini sudah terdaftar." : ""),
      setError(p, p.value.length < 6 ? "Password minimal 6 karakter." : ""),
      setError(k, k.value !== p.value ? "Konfirmasi tidak sama dengan password." : "")
    ];
    if (hasil.includes(false)) return;
    const baru = ambil("users");
    baru.push({ id: getUsers().length + 1, nama: n.value.trim(), email: em.value.trim().toLowerCase(), password: p.value, role: "User" });
    simpan("users", baru);
    alert("Pendaftaran berhasil. Silakan login dengan akun baru Anda.");
    e.target.reset(); $("#modalDaftar").close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
});
