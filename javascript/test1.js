(function () {
  // Ensure DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('player');
    const lyricsContainer = document.getElementById('lyrics');
    const debugContainer = document.getElementById('debug');

    // Check if required elements exist
    if (!audio || !lyricsContainer || !debugContainer) {
      console.error('Required elements missing: audio, lyrics, or debug container');
      return;
    }

    // Parse lyrics (assuming lyricsText is globally available)
    let lyrics = [];
    try {
      lyrics = window.lyricsText.split('<br>').map(line => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseFloat(match[2]);
          const time = minutes * 60 + seconds;
          return { start: time, text: match[3].trim() };
        }
        return null;
      }).filter(line => line !== null);
    } catch (e) {
      debugContainer.textContent = 'Error parsing lyrics: ' + e.message;
      console.error('Lyrics parsing failed:', e);
    }

    let player;
    try {
      player = new Plyr('#player', {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        seekTime: 5,
        disableContextMenu: true
      });
      debugContainer.textContent = 'Plyr initialized successfully';
      console.log('Plyr initialized');
    } catch (e) {
      debugContainer.textContent = 'Plyr failed to initialize: ' + e.message;
      console.error('Plyr initialization failed:', e);
      audio.controls = true; // Fallback to native controls
    }

    audio.addEventListener('loadeddata', () => {
      debugContainer.textContent = 'Audio loaded, duration: ' + audio.duration.toFixed(2) + 's';
      console.log('Audio loaded');
      // Ensure audio source is valid
      if (!audio.src) {
        debugContainer.textContent = 'No audio source specified';
        console.error('Audio source missing');
      }
    });

    audio.addEventListener('error', (e) => {
      debugContainer.textContent = 'Audio error: ' + e.message;
      console.error('Audio failed to load:', e);
    });

    // Prevent multiple timeupdate listeners
    const timeUpdateHandler = () => {
      const currentTime = audio.currentTime;
      let currentLyric = null;

      for (let i = 0; i < lyrics.length; i++) {
        const nextLyric = lyrics[i + 1];
        if (currentTime >= lyrics[i].start && (!nextLyric || currentTime < nextLyric.start)) {
          currentLyric = lyrics[i];
          break;
        }
      }

      if (currentLyric && lyricsContainer.textContent !== currentLyric.text) {
        lyricsContainer.textContent = currentLyric.text;
        lyricsContainer.classList.add('active');
        debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, Lyric: ${currentLyric.text}`;
      } else if (!currentLyric && lyricsContainer.textContent !== '') {
        lyricsContainer.textContent = '';
        lyricsContainer.classList.remove('active');
        debugContainer.textContent = `Time: ${currentTime.toFixed(2)}s, No lyric`;
      }

      // Sync Plyr seekbar
      if (player && player.currentTime !== currentTime) {
        player.currentTime = currentTime;
      }
    };

    audio.removeEventListener('timeupdate', audio.timeupdate);
    audio.addEventListener('timeupdate', timeUpdateHandler);

    audio.addEventListener('ended', () => {
      lyricsContainer.textContent = '';
      lyricsContainer.classList.remove('active');
      debugContainer.textContent = 'Audio ended, resetting';
      console.log('Audio ended');
      audio.currentTime = 0;
      if (player) {
        player.currentTime = 0;
        player.stop();
      }
    });

    // Test lyrics function
    window.testLyrics = function () {
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
        console.log('No lyrics available');
      }
    };
  });
})();
