// Ambil elemen tombol toggle
const toggleButton = document.getElementById('toggle-dark-mode');
// Ambil body
const body = document.body;

// Cek apakah ada preferensi tema di localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
}

// Event listener untuk tombol toggle
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Simpan preferensi tema ke localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark-mode');
    } else {
        localStorage.setItem('theme', '');
    }
});
