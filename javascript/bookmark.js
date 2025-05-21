// Data awal dari localStorage
var articles = JSON.parse(localStorage.getItem("artikels") || "[]");
var bookmarks = JSON.parse(localStorage.getItem("bookmarkIds") || "[]");

// Render input form manual (hindari <form>)
document.getElementById("add-artikel").innerHTML = 
  "<b>Judul:</b><br><input id='judul'><br><b>Isi:</b><br><input id='isi'><br><button onclick='tambahArtikel()'>Tambah</button><hr>";

// Render semua
function render() {
  var out = "";
  for (var i = 0; i < articles.length; i++) {
    var a = articles[i];
    var loved = bookmarks.includes(a.id) ? "❤️" : "🤍";
    out += "<div><b>" + a.judul + "</b><br>" + a.isi + 
      "<br><span onclick='toggleBookmark(\"" + a.id + "\")' style='font-size:20px;cursor:pointer'>" + loved + "</span></div><hr>";
  }
  document.getElementById("daftar-artikel").innerHTML = out;
  renderBookmarks();
}

function tambahArtikel() {
  var j = document.getElementById("judul").value;
  var i = document.getElementById("isi").value;
  if (!j || !i) return alert("Lengkapi data!");
  var newA = { id: Date.now().toString(), judul: j, isi: i };
  articles.push(newA);
  localStorage.setItem("artikels", JSON.stringify(articles));
  document.getElementById("judul").value = "";
  document.getElementById("isi").value = "";
  render();
}

function toggleBookmark(id) {
  var idx = bookmarks.indexOf(id);
  if (idx >= 0) bookmarks.splice(idx, 1);
  else bookmarks.push(id);
  localStorage.setItem("bookmarkIds", JSON.stringify(bookmarks));
  render();
}

function renderBookmarks() {
  var out = "<b>Bookmark ❤️:</b><br><ul>";
  for (var i = 0; i < bookmarks.length; i++) {
    var a = articles.find(a => a.id === bookmarks[i]);
    if (a) out += "<li>" + a.judul + "</li>";
  }
  out += "</ul>";
  document.getElementById("bookmark-list").innerHTML = out;
}

// Jalankan pertama kali
render();
