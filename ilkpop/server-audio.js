document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById('player');
  const lyricsContainer = document.getElementById('lyrics');
  const debugContainer = document.getElementById('debug');

  if (!audio || !debugContainer) {
    console.error('Required audio or debug elements not found');
    if (debugContainer) debugContainer.textContent = 'Error: Audio or debug element missing';
    return;
  }

  // --- AUTO FALLBACK SOURCE ---
  (function setDefaultAudioSource() {
    const ds = audio.dataset;

    const fallback =
      ds.src && ds.src.trim() !== "" ? ds.src :
      ds.gdrive && ds.gdrive.trim() !== "" ? ds.gdrive :
      ds.meownime && ds.meownime.trim() !== "" ? ds.meownime :
      ds.wallkpop && ds.wallkpop.trim() !== "" ? ds.wallkpop :
      ds.metrolagu && ds.metrolagu.trim() !== "" ? ds.metrolagu :
      ds.ilkpop && ds.ilkpop.trim() !== "" ? ds.ilkpop :
      "";

    if (audio.getAttribute("src") === "" || !audio.getAttribute("src")) {
      if (fallback !== "") {
        audio.src = fallback;
        console.log("Auto-fallback source dipakai:", fallback);
      } else {
        console.warn("Tidak ada sumber audio yang bisa dipakai.");
      }
    }
  })();

  debugContainer.textContent = 'Plyr initializing...';

  let isInitialized = false;

  // ✅ Aman walau tidak ada script const lyricsText = ...
  let lyrics = [];
  if (typeof lyricsText !== 'undefined' && typeof lyricsText === 'string') {
    lyrics = lyricsText.split('<br>').map(line => {
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const time = minutes * 60 + seconds;
        return { start: time, text: match[3].trim() };
      }
      return null;
    }).filter(line => line !== null);
  } else {
    console.warn('lyricsText not found — running without synced lyrics.');
    debugContainer.textContent = 'No lyrics found — audio only mode';
  }

  let player;
  const initializePlyrWithTimeout = async () => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout after 10 seconds')), 10000));

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
        isInitialized = true;
        debugContainer.textContent = 'Audio loaded successfully';
        resolve();
      }, { once: true });
      audio.addEventListener('error', () => reject(new Error('Audio failed to load')), { once: true });
      audio.load();
    });

    try {
      await Promise.race([Promise.all([plyrPromise, audioLoadPromise]), timeoutPromise]);
      console.log('Plyr initialized and audio loaded successfully');
    } catch (e) {
      debugContainer.textContent = 'Initialization failed: ' + e.message;
      console.error('Initialization error:', e);
    }
  };

  initializePlyrWithTimeout();

  // 🎵 Tambahkan menu server dengan event ganti server → tampil "Loading..."
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
        `<div style="display: flex; align-items: center; padding: 4px 10px; gap: 6px;">
          <span style="font-size: 12px;">Server</span>
          <select style="font-size: 12px; flex: 1;">
            ${options}
          </select>
        </div>`;
      menu.appendChild(customItem);

      // 🟡 Saat user ganti server
      const selectEl = customItem.querySelector('select');
      selectEl.addEventListener('change', (e) => {
        const newSrc = e.target.value;
        debugContainer.textContent = 'Loading new server...';
        audio.src = newSrc;
        audio.load();
      });
    }
  });

  // 🔄 Saat audio mulai memuat
  audio.addEventListener('loadstart', () => {
    debugContainer.textContent = 'Loading audio...';
  });

  // ✅ Saat audio siap
  audio.addEventListener('loadeddata', () => {
    debugContainer.textContent = 'Audio loaded successfully';
  });

  // ❌ Kalau error
  audio.addEventListener('error', (e) => {
    isInitialized = false;
    debugContainer.textContent = 'Audio failed to load';
    console.error('Audio error:', e);
  });

  // 🕒 Update lirik & waktu
  audio.addEventListener('timeupdate', () => {
    if (!isInitialized || lyrics.length === 0) {
      debugContainer.textContent = `Time: ${audio.currentTime.toFixed(2)}s`;
      return;
    }

    const currentTime = audio.currentTime;
    const currentLyric = lyrics.find(lyric =>
      currentTime >= lyric.start &&
      (lyrics[lyrics.indexOf(lyric) + 1] ? currentTime < lyrics[lyrics.indexOf(lyric) + 1].start : true)
    );

    if (lyricsContainer) {
      if (currentLyric) {
        lyricsContainer.textContent = currentLyric.text;
        lyricsContainer.classList.add('active');
      } else {
        lyricsContainer.textContent = '';
        lyricsContainer.classList.remove('active');
      }
    }

    debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s`;
  });

  // 🔚 Saat audio selesai
  audio.addEventListener('ended', () => {
    if (lyricsContainer) {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
    }
    debugContainer.textContent = 'Audio ended';
  });

  // 🧪 Tes manual
  window.testLyrics = function() {
    if (lyrics.length > 0 && lyricsContainer) {
      lyricsContainer.textContent = lyrics[0].text;
      lyricsContainer.classList.add('active');
      debugContainer.textContent = 'Test: Displaying first lyric';
      setTimeout(() => {
        lyricsContainer.textContent = '';
        lyricsContainer.classList.remove('active');
        debugContainer.textContent = 'Wait until the running lyrics appear';
      }, 2000);
    } else {
      debugContainer.textContent = 'Test: No running lyrics';
    }
  };
});
