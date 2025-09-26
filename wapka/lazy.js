/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./resources/js/lazyLoad.js ***!
  \**********************************/
var lazyImages = document.querySelectorAll("img.lazy");
var lazyVideos = document.querySelectorAll("video.lazy");

function onContentLoaded() {
  if ("IntersectionObserver" in window) {
    var lazyObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          target.src = target.dataset.src;
          setTimeout(function () {
            target.classList.remove("lazy");
          }, 1500);
          lazyObserver.unobserve(target);
        }
      });
    });
    lazyImages.forEach(function (lazyImage) {
      lazyObserver.observe(lazyImage);
    });
    lazyVideos.forEach(function (lazyVideo) {
      lazyObserver.observe(lazyVideo);
    });
  } else {
    fallbackIntersectionObserver();
  }
}

function fallbackIntersectionObserver() {
  lazyImages.forEach(function (lazyImage) {
    lazyImage.src = lazyImage.dataset.src;
    lazyImage.classList.remove("lazy");
  });
  lazyVideos.forEach(function (lazyVideo) {
    lazyVideo.src = lazyVideo.dataset.src;
    lazyVideo.classList.remove("lazy");
  });
}

function removeLoadingScreen() {
  var loadingElmt = document.querySelector(".page--loading");
  var waitTime = 2000;
  setTimeout(function () {
    loadingElmt.remove();
  }, waitTime);
}

document.addEventListener("DOMContentLoaded", function () {
  removeLoadingScreen();

  if (lazyImages.length || lazyVideos.length) {
    onContentLoaded();
  }
});
/******/ })()
;
