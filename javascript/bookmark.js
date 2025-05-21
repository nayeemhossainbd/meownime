    const articles = document.querySelectorAll('article');
    const bookmarkedList = document.getElementById('bookmarked-list');

    function getBookmarks() {
      return JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    }

    function saveBookmarks(data) {
      localStorage.setItem('bookmarkedArticles', JSON.stringify(data));
    }

    function isBookmarked(link) {
      const bookmarks = getBookmarks();
      return bookmarks.some(item => item.link === link);
    }

    function toggleBookmark(article, icon) {
      const title = article.dataset.title;
      const link = article.dataset.link;

      let bookmarks = getBookmarks();
      const index = bookmarks.findIndex(item => item.link === link);

      if (index !== -1) {
        bookmarks.splice(index, 1);
        icon.textContent = '🤍';
      } else {
        bookmarks.push({ title, link });
        icon.textContent = '❤️';
      }

      saveBookmarks(bookmarks);
      renderBookmarkedList();
    }

    function renderBookmarkedList() {
      const bookmarks = getBookmarks();
      bookmarkedList.innerHTML = '';
      bookmarks.forEach(({ title, link }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link;
        a.target = "_blank";
        a.textContent = title;
        li.appendChild(a);
        bookmarkedList.appendChild(li);
      });
    }

    // Setup event & icon
    articles.forEach(article => {
      const link = article.dataset.link;
      const icon = article.querySelector('.love');

      if (isBookmarked(link)) {
        icon.textContent = '❤️';
      }

      icon.addEventListener('click', () => {
        toggleBookmark(article, icon);
      });
    });

    renderBookmarkedList();
