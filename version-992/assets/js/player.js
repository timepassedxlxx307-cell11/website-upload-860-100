(function () {
  window.setupMoviePlayer = function (source) {
    var video = document.getElementById("movie-video");
    var layer = document.getElementById("play-layer");
    if (!video || !layer || !source) {
      return;
    }

    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        layer.innerHTML = "<strong>暂时无法播放，请稍后重试</strong>";
      }
    }

    function play() {
      attach();
      layer.classList.add("hidden");
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          layer.classList.remove("hidden");
        });
      }
    }

    layer.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function () {
      layer.classList.add("hidden");
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
