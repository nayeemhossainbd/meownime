document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("saved-list");
    const data = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");

    if (data.length === 0) {
      container.innerHTML = "<p>Tidak ada bookmark.</p>";
      return;
    }

    const ul = document.createElement("ul");
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${item.link}">${item.title}</a>`;
      ul.appendChild(li);
    });

    container.appendChild(ul);
  });
