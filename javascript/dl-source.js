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

  const sourceList = document.getElementById("source-list");

  // tampilkan source list hanya jika >1 sumber
  if (availableSources.length > 1 && sourceList) {
    sourceList.style.display = "flex";
    setTimeout(() => sourceList.style.opacity = 1, 50);
  }

  // tampilkan blok download pertama yang ada
  if (availableSources.length > 0) {
    const firstSource = availableSources[0];
    const block = document.getElementById("dl-" + firstSource);
    if (block) {
      block.style.display = "block";
      setTimeout(() => block.style.opacity = 1, 50);
    }
  }
});

function showDownload(source) {
  const blocks = document.querySelectorAll('.host');
  blocks.forEach(b => {
    b.style.opacity = 0;
    b.style.display = 'none';
  });

  const block = document.getElementById("dl-" + source);
  if (block) {
    block.style.display = "block";
    setTimeout(() => block.style.opacity = 1, 50);
  }
}
