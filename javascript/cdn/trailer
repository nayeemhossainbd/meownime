function openTrailer(url) {
  const modal = document.getElementById("trailerModal");
  const frame = document.getElementById("trailerFrame");

  modal.style.display = "block";
  frame.src = url + "?autoplay=1"; 
}

function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  const frame = document.getElementById("trailerFrame");

  modal.style.display = "none";
  frame.src = ""; 
}

// Tutup kalau klik luar popup
window.onclick = function(event) {
  const modal = document.getElementById("trailerModal");
  if (event.target === modal) {
    closeTrailer();
  }
}
