document.addEventListener("DOMContentLoaded", function() {
const sources = ["meownime", "otakudesu", "otakudesu2", "samehadaku", "winbu", "kuramanime"];
const availableSources = [];

// sembunyikan li jika sumber kosong & hitung yang ada isi
sources.forEach(src => {
const block = document.getElementById("dl-" + src);
const li = document.getElementById("src-" + src);

if (!block || block.innerHTML.trim() === "" || block.querySelectorAll("li").length === 0) {
if (li) li.style.display = "none";
} else {
availableSources.push(src);
}
});

// jika hanya 1 sumber tersedia → sembunyikan source list
const sourceList = document.getElementById("source-list");
if (availableSources.length <= 1 && sourceList) {
sourceList.style.display = "none";
}

// tampilkan blok download dari sumber pertama yang tersedia
if (availableSources.length > 0) {
showDownload(availableSources[0]);
}
});

function showDownload(source) {
const blocks = document.querySelectorAll('.host');
blocks.forEach(b => b.style.display = 'none');

const block = document.getElementById("dl-" + source);
if (block) block.style.display = "block";
}
