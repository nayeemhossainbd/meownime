
const audio = document.getElementById('player');
const lyricsContainer = document.getElementById('lyrics');
const debugContainer = document.getElementById('debug');

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
try {
  player = new Plyr('#player');
  debugContainer.textContent = 'Plyr initialized';
  console.log('Plyr initialized successfully');
} catch (e) {
  debugContainer.textContent = 'Plyr failed to load';
  console.error('Plyr initialization failed:', e);
}

audio.addEventListener('loadeddata', () => {
  debugContainer.textContent = 'Audio loaded successfully';
  console.log('Audio loaded');
});

audio.addEventListener('error', (e) => {
  debugContainer.textContent = 'Audio failed to load: ' + e.message;
  console.error('Audio error:', e);
});

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  const currentLyric = lyrics.find(lyric =>
    currentTime >= lyric.start &&
    (lyrics[lyrics.indexOf(lyric) + 1] ? currentTime < lyrics[lyrics.indexOf(lyric) + 1].start : true)
  );

  if (currentLyric) {
    lyricsContainer.textContent = currentLyric.text;
    lyricsContainer.classList.add('active');
    debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, Lyric: ${currentLyric.text}`;
  } else {
    lyricsContainer.textContent = '';
    lyricsContainer.classList.remove('active');
    debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, No lyric`;
  }
});

audio.addEventListener('ended', () => {
  lyricsContainer.textContent = '';
  lyricsContainer.classList.remove('active');
  debugContainer.textContent = 'Audio ended';
});

function testLyrics() {
  if (lyrics.length > 0) {
    lyricsContainer.textContent = lyrics[0].text;
    lyricsContainer.classList.add('active');
    debugContainer.textContent = 'Test: Displaying first lyric';
    setTimeout(() => {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
    }, 2000);
  } else {
    debugContainer.textContent = 'Test: No lyrics available';
  }
}

// Inject server switch dropdown menu after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const players = document.querySelectorAll(".plyr");

  players.forEach(wrapper => {
    const el = wrapper.querySelector("audio");
    const gdrive = el?.dataset.gdrive;
    const wallkpop = el?.dataset.wallkpop;

    const menu = wrapper.querySelector('.plyr__menu__container [role="menu"]');
    if (menu && gdrive && wallkpop) {
      const customItem = document.createElement('div');
      customItem.className = 'plyr__menu__item';
      customItem.setAttribute('role', 'menuitem');
      customItem.innerHTML =
        '<div style="display: flex; align-items: center; padding: 4px 10px; gap: 6px;">' +
          '<span style="font-size: 12px;">Server</span>' +
          '<select onchange="this.closest(\'.plyr\').querySelector(\'audio\').src = this.value" style="font-size: 12px; flex: 1;">' +
            `<option value="${gdrive}">GDrive</option>` +
            `<option value="${wallkpop}">Wallkpop</option>` +
          '</select>' +
        '</div>';
      menu.appendChild(customItem);
    }
  });
});
