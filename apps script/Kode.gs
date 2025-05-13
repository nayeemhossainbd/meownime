function doGet() {
  try {
    var html = HtmlService.createHtmlOutputFromFile('MultiForm')
        .setTitle('[VERCEL] Import Multiple Files ke Google Drive');
    Logger.log("HTML file loaded successfully");
    return html;
  } catch (e) {
    Logger.log("Error loading HTML file: " + e.toString());
    throw new Error("Failed to load MultiForm.html: " + e.toString());
  }
}

function startImport(formData) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('isRunning', 'true');
  scriptProperties.setProperty('currentIndex', '0');
  scriptProperties.setProperty('results', JSON.stringify([]));

  var urls = formData.urls.split('\n').filter(url => url.trim() !== '');
  var fileNames = formData.fileNames.split('\n').filter(name => name.trim() !== '');
  var artists = formData.artists.split('\n').filter(artist => artist.trim() !== '');
  var albums = formData.albums.split('\n').filter(album => album.trim() !== '');
  var genres = formData.genres.split('\n').filter(genre => genre.trim() !== '');
  var years = formData.years.split('\n').filter(year => year.trim() !== '');
  var composers = formData.composers.split('\n').filter(composer => composer.trim() !== '');
  var comments = formData.comments.split('\n').filter(comment => comment.trim() !== '');
  var coverUrls = formData.coverUrls.split('\n').filter(cover => cover.trim() !== '');
  var driveFileNames = formData.driveFileNames.split('\n').filter(name => name.trim() !== '');
  var tracks = formData.tracks.split('\n').filter(track => track.trim() !== '');
  var publishers = formData.publishers.split('\n').filter(publisher => publisher.trim() !== '');
  var discs = formData.discs.split('\n').filter(disc => disc.trim() !== '');
  var isrcs = formData.isrcs.split('\n').filter(isrc => isrc.trim() !== '');
  var encodedBys = formData.encodedBys.split('\n').filter(encodedBy => encodedBy.trim() !== '');
  var lyricists = formData.lyricists.split('\n').filter(lyricist => lyricist.trim() !== '');
  var mediaTypes = formData.mediaTypes.split('\n').filter(mediaType => mediaType.trim() !== '');
  var keys = formData.keys.split('\n').filter(key => key.trim() !== '');
  var lengths = formData.lengths.split('\n').filter(length => length.trim() !== '');
  var copyrights = formData.copyrights.split('\n').filter(copyright => copyright.trim() !== '');
  var languages = formData.languages.split('\n').filter(language => language.trim() !== '');
  var lyrics = formData.lyrics.split('\n\n').map(lyric => lyric.trim());
  var urlsTag = formData.urlsTag.split('\n').filter(urlTag => urlTag.trim() !== '');
  var copyrightUrls = formData.copyrightUrls.split('\n').filter(copyrightUrl => copyrightUrl.trim() !== '');
  var watermark = formData.watermark || "";
  var ids = formData.id.split('\n').filter(id => id.trim() !== '');
  var duration = formData.duration.split('\n').filter(d => d.trim() !== '');

  // Parse client-side importedData
  var clientImportedData = formData.importedData ? JSON.parse(formData.importedData) : [];

  var defaultLyrics = "Lyrics Not Available, request on the metrolagu.wapkiz.mobi forum for mp3 files with lyrics or add them yourself, search for lyrics from Google";

  var importedData = urls.map((url, index) => {
    let lyricEntry = (index < lyrics.length && lyrics[index] && lyrics[index].trim() !== '') ? lyrics[index] : defaultLyrics;
    return {
      id: ids[index] || '',
      fileNames: fileNames[index] || '',
      artists: artists[index] || '',
      driveFileNames: driveFileNames[index] || '',
      albums: albums[index] || '',
      genres: genres[index] || '',
      years: years[index] || '',
      duration: duration[index] || '',
      lyrics: lyricEntry,
      originalLyrics: clientImportedData[index]?.originalLyrics || lyricEntry // Use client-side originalLyrics if available
    };
  });

  var results = [];
  var jsonArray = [];
  var processedUrls = urls.map(function(url) {
    if (url.includes('drive.google.com')) {
      var fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return "https://drive.google.com/uc?export=download&id=" + fileIdMatch[1];
      }
    }
    return url;
  });

  scriptProperties.setProperty('totalFiles', urls.length.toString());
  scriptProperties.setProperty('importedData', JSON.stringify(importedData));

  for (var currentIndex = 0; currentIndex < urls.length; currentIndex++) {
    try {
      var url = processedUrls[currentIndex];
      var customName = (currentIndex < fileNames.length && fileNames[currentIndex]) ? fileNames[currentIndex] : "";

      var tags = {
        title: customName || "",
        artist: (currentIndex < artists.length && artists[currentIndex]) ? artists[currentIndex] : "",
        album: (currentIndex < albums.length && albums[currentIndex]) ? albums[currentIndex] : "",
        genre: (currentIndex < genres.length && genres[currentIndex]) ? genres[currentIndex] : "",
        year: (currentIndex < years.length && years[currentIndex]) ? years[currentIndex] : "",
        composer: (currentIndex < composers.length && composers[currentIndex]) ? composers[currentIndex] : "",
        comment: (currentIndex < comments.length && comments[currentIndex]) ? comments[currentIndex] : "",
        coverUrl: (currentIndex < coverUrls.length && coverUrls[currentIndex]) ? coverUrls[currentIndex] : "",
        track: (currentIndex < tracks.length && tracks[currentIndex]) ? tracks[currentIndex] : "",
        publisher: (currentIndex < publishers.length && publishers[currentIndex]) ? publishers[currentIndex] : "",
        disc: (currentIndex < discs.length && discs[currentIndex]) ? discs[currentIndex] : "",
        isrc: (currentIndex < isrcs.length && isrcs[currentIndex]) ? isrcs[currentIndex] : "",
        encoded_by: (currentIndex < encodedBys.length && encodedBys[currentIndex]) ? encodedBys[currentIndex] : "",
        lyricist: (currentIndex < lyricists.length && lyricists[currentIndex]) ? lyricists[currentIndex] : "",
        media_type: (currentIndex < mediaTypes.length && mediaTypes[currentIndex]) ? mediaTypes[currentIndex] : "",
        key: (currentIndex < keys.length && keys[currentIndex]) ? keys[currentIndex] : "",
        length: (currentIndex < lengths.length && lengths[currentIndex]) ? lengths[currentIndex] : "",
        copyright: (currentIndex < copyrights.length && copyrights[currentIndex]) ? copyrights[currentIndex] : "",
        language: (currentIndex < languages.length && languages[currentIndex]) ? languages[currentIndex] : "",
        lyrics: (currentIndex < lyrics.length && lyrics[currentIndex] && lyrics[currentIndex].trim() !== '') ? lyrics[currentIndex] : defaultLyrics,
        url: (currentIndex < urlsTag.length && urlsTag[currentIndex]) ? urlsTag[currentIndex] : "",
        copyrightUrl: (currentIndex < copyrightUrls.length && copyrightUrls[currentIndex]) ? copyrightUrls[currentIndex] : "",
        watermark: watermark
      };

      Logger.log("Processing URL: " + url);
      Logger.log("Tags being sent to Flask: " + JSON.stringify(tags));

      var serverUrl = "https://mp3-tags-editor.vercel.app/edit-tags";
      var maxRetries = 3;
      var retryDelay = 5000;
      var response;
      var attempt = 0;
      var success = false;

      while (attempt < maxRetries && !success) {
        try {
          response = UrlFetchApp.fetch(serverUrl, {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify({ url: url, tags: tags }),
            muteHttpExceptions: true
          });

          var responseCode = response.getResponseCode();
          Logger.log("Response Code from Flask (Attempt " + (attempt + 1) + "): " + responseCode);
          if (responseCode === 200) {
            success = true;
          } else {
            var responseBody = response.getContentText();
            Logger.log("Response Body from Flask (Attempt " + (attempt + 1) + "): " + responseBody);
            throw new Error("Flask server returned error: " + responseCode + " - " + responseBody);
          }
        } catch (fetchError) {
          attempt++;
          Logger.log("Fetch Error (Attempt " + attempt + "): " + fetchError.toString());
          if (attempt >= maxRetries) {
            throw new Error("Failed to connect to Flask server after " + maxRetries + " attempts: " + fetchError.toString());
          }
          Utilities.sleep(retryDelay);
        }
      }

      if (!success) {
        throw new Error("Failed to connect to Flask server after all retries.");
      }

      Logger.log("Response from Flask received: " + response.getResponseCode());

      var editedBlob = response.getBlob();
      Logger.log("Blob size received from Flask: " + editedBlob.getBytes().length);

      var fileNameFromHeader = response.getHeaders()['Content-Disposition']?.match(/filename="(.+)"/)?.[1];
      Logger.log("File name from Flask header: " + fileNameFromHeader);
      var defaultFileName = fileNameFromHeader ? decodeURIComponent(fileNameFromHeader) : "edited_song.mp3";
      Logger.log("Default file name: " + defaultFileName);
      Logger.log("Custom name from fileNames: " + customName);
      Logger.log("Drive file name (if provided): " + (currentIndex < driveFileNames.length ? driveFileNames[currentIndex] : "Not provided"));

      var fileName;
      if (currentIndex < driveFileNames.length && driveFileNames[currentIndex] && driveFileNames[currentIndex].trim()) {
        fileName = driveFileNames[currentIndex];
        Logger.log("Using driveFileNames for file name: " + fileName);
      } else if (customName && customName.trim()) {
        fileName = customName;
        Logger.log("Using customName for file name: " + fileName);
      } else {
        fileName = defaultFileName;
        Logger.log("Using defaultFileName for file name: " + fileName);
      }

      fileName = String(fileName).trim() || "default_song.mp3";
      Logger.log("Final file name after validation: " + fileName);

      if (!fileName.toLowerCase().endsWith('.mp3')) {
        fileName += '.mp3';
        Logger.log("Added .mp3 extension to file name: " + fileName);
      }

      var existingFiles = DriveApp.getFilesByName(fileName);
      var deletedCount = 0;
      while (existingFiles.hasNext()) {
        var fileToDelete = existingFiles.next();
        fileToDelete.setTrashed(true);
        deletedCount++;
      }
      Logger.log("Deleted " + deletedCount + " existing files with the same name");

      var file = DriveApp.createFile(editedBlob);
      Logger.log("File created in Drive with ID: " + file.getId());
      file.setName(fileName);
      Logger.log("File name set to: " + fileName);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      Logger.log("Sharing permissions set to anyone with link");

      var fileUrl = file.getUrl();
      Logger.log("File URL: " + fileUrl);

      var progress = Math.round(((currentIndex + 1) / urls.length) * 100);

      results.push("Berhasil: " + fileName + " - Link: " + fileUrl + " (Progres: " + progress + "%)" +
                   (Object.keys(tags).length > 0 ? " - Tags: " + JSON.stringify(tags) : ""));

      var importedItem = importedData[currentIndex] || {};
      var lyricsForJson = importedItem.originalLyrics || defaultLyrics;
      Logger.log("Lyrics for JSON (index " + currentIndex + "): " + lyricsForJson);

      jsonArray.push({
        id: importedItem.id || '',
        fileNames: importedItem.fileNames || '',
        artists: importedItem.artists || '',
        driveFileNames: fileName,
        albums: importedItem.albums || '',
        genres: importedItem.genres || '',
        years: importedItem.years || '',
        duration: importedItem.duration || '',
        driveLink: fileUrl,
        lyrics: lyricsForJson
      });
    } catch (e) {
      var errorMessage = e.toString();
      Logger.log("Error in processing file " + (currentIndex + 1) + ": " + errorMessage);
      results.push("Gagal pada file ke-" + (currentIndex + 1) + ": " + errorMessage);
    }

    scriptProperties.setProperty('results', JSON.stringify(results));
    scriptProperties.setProperty('currentIndex', (currentIndex + 1).toString());
  }

  // Update GitHub repository with JSON results
  try {
    var githubToken = "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";
    var repoOwner = "caraaink";
    var repoName = "meownime";
    var filePath = "file/import_results.json";
    var apiUrl = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/" + filePath;

    // Get current file SHA (if exists)
    var sha = "";
    try {
      var getResponse = UrlFetchApp.fetch(apiUrl, {
        method: "get",
        headers: {
          "Authorization": "Bearer " + githubToken,
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28"
        },
        muteHttpExceptions: true
      });

      if (getResponse.getResponseCode() === 200) {
        var fileData = JSON.parse(getResponse.getContentText());
        sha = fileData.sha;
        Logger.log("Retrieved SHA for existing file: " + sha);
      } else if (getResponse.getResponseCode() !== 404) {
        throw new Error("Failed to check existing file: " + getResponse.getResponseCode());
      }
    } catch (e) {
      Logger.log("Error checking existing GitHub file: " + e.toString());
    }

    // Prepare JSON content with explicit UTF-8 encoding
    var jsonStr = JSON.stringify(jsonArray, null, 2);
    Logger.log("JSON string for GitHub: " + jsonStr.substring(0, 500) + "...");
    var base64Content = Utilities.base64Encode(jsonStr, Utilities.Charset.UTF_8);

    // Update or create file
    var payload = {
      message: "Update import_results.json with latest import data",
      content: base64Content,
      branch: "main"
    };
    if (sha) {
      payload.sha = sha;
    }

    var updateResponse = UrlFetchApp.fetch(apiUrl, {
      method: "put",
      headers: {
        "Authorization": "Bearer " + githubToken,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    if (updateResponse.getResponseCode() === 200 || updateResponse.getResponseCode() === 201) {
      Logger.log("Successfully updated GitHub file: " + filePath);
      results.push("GitHub updated: https://raw.githubusercontent.com/" + repoOwner + "/" + repoName + "/main/" + filePath);
    } else {
      var errorBody = updateResponse.getContentText();
      Logger.log("Failed to update GitHub file: " + updateResponse.getResponseCode() + " - " + errorBody);
      results.push("Failed to update GitHub file: " + updateResponse.getResponseCode());
    }
  } catch (e) {
    Logger.log("Error updating GitHub file: " + e.toString());
    results.push("Error updating GitHub file: " + e.toString());
  }

  scriptProperties.setProperty('results', JSON.stringify(results));
  scriptProperties.setProperty('isRunning', 'false');

  return "Proses import selesai.";
}

function getProgress() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var results = JSON.parse(scriptProperties.getProperty('results') || '[]');
  var totalFiles = parseInt(scriptProperties.getProperty('totalFiles') || '0');
  var currentIndex = parseInt(scriptProperties.getProperty('currentIndex') || '0');
  var isRunning = scriptProperties.getProperty('isRunning') === 'true';
  var progress = totalFiles > 0 ? Math.round((currentIndex / totalFiles) * 100) : 0;

  return {
    progress: progress,
    results: results,
    isRunning: isRunning,
    totalFiles: totalFiles,
    currentIndex: currentIndex
  };
}

function getHistory() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var results = JSON.parse(scriptProperties.getProperty('results') || '[]');
  var importedData = JSON.parse(scriptProperties.getProperty('importedData') || '[]');
  var totalFiles = parseInt(scriptProperties.getProperty('totalFiles') || '0');
  var currentIndex = parseInt(scriptProperties.getProperty('currentIndex') || '0');
  var isRunning = scriptProperties.getProperty('isRunning') === 'true';
  var progress = totalFiles > 0 ? Math.round((currentIndex / totalFiles) * 100) : 0;

  return {
    progress: progress,
    results: results,
    importedData: importedData,
    isRunning: isRunning,
    totalFiles: totalFiles,
    currentIndex: currentIndex
  };
}

function clearHistory() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();
  return "Histori telah dihapus.";
}