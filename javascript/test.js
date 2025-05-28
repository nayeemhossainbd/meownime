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
  player = new Plyr('#player', {
    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    seekTime: 5
  });
  debugContainer.textContent = 'Plyr initialized successfully';
  console.log('Plyr initialized');
} catch (e) {
  debugContainer.textContent = 'Plyr failed to initialize: ' + e.message;
  console.error('Plyr initialization failed:', e);
  // Fallback to native audio controls
  audio.controls = true;
}

audio.addEventListener('loadeddata', () => {
  debugContainer.textContent = 'Audio loaded successfully';
  console.log('Audio loaded, duration: ' + audio.duration);
});

audio.addEventListener('error', (e) => {
  debugContainer.textContent = 'Audio failed to load: ' + e.message;
  console.error('Audio error:', e);
});

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  let currentLyric = null;

  for (let i = 0; i < lyrics.length; i++) {
    const nextLyric = lyrics[i + 1];
    if (currentTime >= lyrics[i].start && (!nextLyric || currentTime < nextLyric.start)) {
      currentLyric = lyrics[i];
      break;
    }
  }

  if (currentLyric) {
    if (lyricsContainer.textContent !== currentLyric.text) {
      lyricsContainer.textContent = currentLyric.text;
      lyricsContainer.classList.add('active');
    }
    debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, Lyric: ${currentLyric.text}`;
  } else {
    if (lyricsContainer.textContent !== '') {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
    }
    debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, No lyric`;
  }

  // Ensure seekbar updates correctly
  if (player) {
    player.currentTime = currentTime;
  }
});

audio.addEventListener('ended', () => {
  lyricsContainer.textContent = '';
  lyricsContainer.classList.remove('active');
  debugContainer.textContent = 'Audio ended, resetting player';
  console.log('Audio ended');
  audio.currentTime = 0; // Reset to start
  if (player) {
    player.currentTime = 0; // Ensure Plyr seekbar resets
    player.stop();
  }
});

// Prevent multiple timeupdate listeners
audio.removeEventListener('timeupdate', audio.timeupdate);
audio.addEventListener('timeupdate', audio.timeupdate);

function testLyrics() {
  if (lyrics.length > 0) {
    lyricsContainer.textContent = lyrics[0].text;
    lyricsContainer.classList.add('active');
    debugContainer.textContent = 'Test: Displaying first lyric';
    console.log('Testing first lyric:', lyrics[0].text);
    setTimeout(() => {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
      debugContainer.textContent = 'Test: Cleared first lyric';
    }, 2000);
  } else {
    debugContainer.textContent = 'Test: No lyrics available';
    console.log('No lyrics available for testing');
  }
}
