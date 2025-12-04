document.addEventListener("DOMContentLoaded", function() {
    const sources = ["meownime", "otakudesu", "otakudesu2", "samehadaku", "winbu", "kuramanime"];
    const availableSources = [];

    const container = document.getElementById("dl-container");
    const sourceListUl = document.querySelector("#source-list ul.source-inline");

    // cek tiap blok yang ada isi
    sources.forEach(src => {
        const block = document.getElementById("dl-" + src);
        if (block && block.innerHTML.trim() !== "" && block.querySelectorAll("li").length > 0) {
            availableSources.push(src);

            // tambahkan li ke source list
            const li = document.getElementById("src-" + src);
            if (li) sourceListUl.appendChild(li);

            // jika container kosong → masukkan blok pertama yang ada isi
            if (!container.querySelector(".host")) {
                container.appendChild(block);
                block.style.display = "block";
                block.style.opacity = 1;
            }
        }
    });

    // tampilkan source list hanya jika >1 sumber
    if (availableSources.length > 1) {
        const sourceList = document.getElementById("source-list");
        sourceList.style.display = "flex";
        setTimeout(() => sourceList.style.opacity = 1, 50);
    }
});

function showDownload(source) {
    const container = document.getElementById("dl-container");
    const blocks = document.querySelectorAll('.host');

    // hapus semua dari container
    blocks.forEach(b => b.style.opacity = 0);
    container.innerHTML = "";

    // tampilkan blok baru
    const block = document.getElementById("dl-" + source);
    if (block) {
        container.appendChild(block);
        block.style.display = "block";
        setTimeout(() => block.style.opacity = 1, 50);
    }
}
