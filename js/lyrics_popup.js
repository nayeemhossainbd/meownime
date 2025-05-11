    document.getElementById('view_lyrics').onclick = function() {
        document.getElementById('lyricsPopup').style.display = 'block';
    }

    document.getElementById('closePopup').onclick = function() {
        document.getElementById('lyricsPopup').style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById('lyricsPopup')) {
            document.getElementById('lyricsPopup').style.display = 'none';
        }
    }
