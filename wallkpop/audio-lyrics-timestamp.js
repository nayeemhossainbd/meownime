document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById('player');
  const lyricsContainer = document.getElementById('lyrics');
  const debugContainer = document.getElementById('debug');

  if (!audio || !lyricsContainer || !debugContainer) {
    console.error('Required DOM elements not found');
    if (debugContainer) debugContainer.textContent = 'Error: Required DOM elements not found';
    return;
  }

  debugContainer.textContent = 'Plyr initialized...'; // Initial message

  let isInitialized = false; // Track initialization status

  const lyrics = lyricsText.split('<br>').map(line => {
    const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      return { start: time, text: match[3].trim() };
    }
    return null;
  }).filter(line => line !== null);

  let player;
  const initializePlyrWithTimeout = async () => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('timeout after 10 seconds'));
      }, 10000);
    });

    const plyrPromise = new Promise((resolve, reject) => {
      try {
        player = new Plyr('#player', { loadSprite: true });
        player.on('ready', () => resolve());
      } catch (e) {
        reject(new Error('Plyr initialization failed: ' + e.message));
      }
    });

    const audioLoadPromise = new Promise((resolve, reject) => {
      audio.addEventListener('loadeddata', () => {
        isInitialized = true; // Set flag on successful load
        resolve();
      }, { once: true });
      audio.addEventListener('error', () => reject(new Error('Audio failed to load')), { once: true });
      audio.load();
    });

    try {
      await Promise.race([
        Promise.all([plyrPromise, audioLoadPromise]),
        timeoutPromise
      ]);
      debugContainer.textContent = 'Plyr initialized and audio loaded';
      debugContainer.style.color = ''; // Reset color
      console.log('Plyr initialized and audio loaded successfully');
    } catch (e) {
      if (e.message === 'timeout after 10 seconds') {
        debugContainer.innerHTML = 'Initialization failed: <span style="color: red;">timeout</span> after 10 seconds';
      } else {
        debugContainer.textContent = 'Initialization failed: ' + e.message;
        debugContainer.style.color = ''; // Reset color for other errors
      }
      console.error('Initialization error:', e);
    }
  };

  initializePlyrWithTimeout();

  const players = document.querySelectorAll(".plyr");
  players.forEach(wrapper => {
    const el = wrapper.querySelector("audio");
    const gdrive = el?.dataset.gdrive;
    const wallkpop = el?.dataset.wallkpop;
    const meownime = el?.dataset.meownime;
    const metrolagu = el?.dataset.metrolagu;
    const ilkpop = el?.dataset.ilkpop;

    const menu = wrapper.querySelector('.plyr__menu__container [role="menu"]');
    if (menu && gdrive && (wallkpop || meownime || metrolagu || ilkpop)) {
      const customItem = document.createElement('div');
      customItem.className = 'plyr__menu__item';
      customItem.setAttribute('role', 'menuitem');

      let options = `<option value="${gdrive}">GDrive</option>`;
      if (wallkpop) options += `<option value="${wallkpop}">Wallkpop</option>`;
      if (meownime) options += `<option value="${meownime}">Meownime</option>`;
      if (metrolagu) options += `<option value="${metrolagu}">Metrolagu</option>`;
      if (ilkpop) options += `<option value="${ilkpop}">Ilkpop</option>`;

      customItem.innerHTML =
        '<div style="display: flex; align-items: center; padding: 4px 10px; gap: 6px;">' +
          '<span style="font-size: 12px;">Server</span>' +
          `<select onchange="this.closest('.plyr').querySelector('audio').src = this.value; this.closest('.plyr').querySelector('audio').load();" style="font-size: 12px; flex: 1;">${options}</select>` +
        '</div>';
      menu.appendChild(customItem);
    }
  });

  audio.addEventListener('loadeddata', () => {
    debugContainer.textContent = 'Audio loaded successfully';
    debugContainer.style.color = ''; // Reset color
    console.log('Audio loaded');
  });

  audio.addEventListener('error', (e) => {
    isInitialized = false; // Reset flag on error
    debugContainer.textContent = 'Audio failed to load: ' + e.message;
    debugContainer.style.color = ''; // Reset color
    console.error('Audio error:', e);
  });

  audio.addEventListener('timeupdate', () => {
    if (!isInitialized) return; // Skip if initialization failed
    const currentTime = audio.currentTime;
    const currentLyric = lyrics.find(lyric =>
      currentTime >= lyric.start &&
      (lyrics[lyrics.indexOf(lyric) + 1] ? currentTime < lyrics[lyrics.indexOf(lyric) + 1].start : true)
    );

    if (currentLyric) {
      lyricsContainer.textContent = currentLyric.text;
      lyricsContainer.classList.add('active');
      debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s`; // Show time when lyric is active
      debugContainer.style.color = ''; // Reset color
    } else {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
      if (lyrics.length > 0) {
        debugContainer.textContent = 'Wait until the running lyrics appear'; // Show waiting message if lyrics exist
        debugContainer.style.color = ''; // Reset color
      } else {
        debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, no running lyrics`; // Show time with no lyrics message
        debugContainer.style.color = ''; // Reset color
      }
    }
  });

  audio.addEventListener('ended', () => {
    if (!isInitialized) return; // Skip if initialization failed
    lyricsContainer.textContent = '';
    lyricsContainer.classList.remove('active');
    debugContainer.textContent = 'Audio ended';
    debugContainer.style.color = ''; // Reset color
  });

  window.testLyrics = function() {
    if (lyrics.length > 0) {
      lyricsContainer.textContent = lyrics[0].text;
      lyricsContainer.classList.add('active');
      debugContainer.textContent = 'Test: Displaying first lyric';
      debugContainer.style.color = ''; // Reset color
      setTimeout(() => {
        lyricsContainer.textContent = '';
        lyricsContainer.classList.remove('active');
        if (lyrics.length > 0) {
          debugContainer.textContent = 'Wait until the running lyrics appear'; // Show waiting message after test if lyrics exist
          debugContainer.style.color = ''; // Reset color
        } else {
          debugContainer.textContent = 'Test: No running lyrics';
          debugContainer.style.color = ''; // Reset color
        }
      }, 2000);
    } else {
      debugContainer.textContent = 'Test: No running lyrics';
      debugContainer.style.color = ''; // Reset color
    }
  };
});
