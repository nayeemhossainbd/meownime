    const articlesContainer = document.getElementById('articles');
    const bookmarkedList = document.getElementById('bookmarked-list');
    const form = document.getElementById('article-form');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    function getArticles() {
      return JSON.parse(localStorage.getItem('allArticles') || '[]');
    }

    function saveArticles(articles) {
      localStorage.setItem('allArticles', JSON.stringify(articles));
    }

    function getBookmarks() {
      return JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    }

    function saveBookmarks(ids) {
      localStorage.setItem('bookmarkedArticles', JSON.stringify(ids));
    }

    function renderArticles() {
      const articles = getArticles();
      const bookmarks = getBookmarks();
      articlesContainer.innerHTML = '';

      articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'article';
        div.dataset.id = article.id;

        const title = document.createElement('h3');
        title.textContent = article.title;

        const content = document.createElement('p');
        content.textContent = article.content;

        const love = document.createElement('span');
        love.className = 'love';
        love.textContent = bookmarks.includes(article.id) ? '❤️' : '🤍';
        love.onclick = () => toggleBookmark(article.id, love);

        div.appendChild(title);
        div.appendChild(content);
        div.appendChild(love);
        articlesContainer.appendChild(div);
      });
    }

    function renderBookmarkedList() {
      const bookmarks = getBookmarks();
      const articles = getArticles();
      bookmarkedList.innerHTML = '';
      articles.filter(a => bookmarks.includes(a.id)).forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.title;
        bookmarkedList.appendChild(li);
      });
    }

    function toggleBookmark(id, loveElement) {
      let bookmarks = getBookmarks();
      if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bid => bid !== id);
        loveElement.textContent = '🤍';
      } else {
        bookmarks.push(id);
        loveElement.textContent = '❤️';
      }
      saveBookmarks(bookmarks);
      renderBookmarkedList();
    }

    form.onsubmit = function (e) {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();

      if (!title || !content) return;

      const articles = getArticles();
      const newArticle = {
        id: Date.now().toString(),
        title,
        content
      };

      articles.push(newArticle);
      saveArticles(articles);
      form.reset();
      renderArticles();
      renderBookmarkedList();
    };

    // Inisialisasi
    renderArticles();
    renderBookmarkedList();
