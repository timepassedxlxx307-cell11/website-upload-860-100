(function () {
  function initVideoPlayer(videoId, stream, poster) {
    var video = document.getElementById(videoId);
    if (!video) {
      return;
    }
    var shell = video.closest(".player-shell");
    var cover = shell ? shell.querySelector("[data-player-cover]") : null;
    var sideButton = document.querySelector("[data-play-toggle]");
    var message = shell ? shell.querySelector("[data-player-message]") : null;
    var loaded = false;
    var hls = null;

    function showMessage(value) {
      if (message) {
        message.textContent = value;
        message.hidden = false;
      }
    }

    function loadStream() {
      if (loaded) {
        return;
      }
      loaded = true;
      video.poster = poster;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            showMessage("播放暂不可用");
          }
        });
      } else {
        video.src = stream;
      }
    }

    function playVideo(event) {
      if (event) {
        event.preventDefault();
      }
      loadStream();
      if (shell) {
        shell.classList.add("is-started");
      }
      var request = video.play();
      if (request && request.catch) {
        request.catch(function () {
          if (shell) {
            shell.classList.remove("is-playing");
          }
        });
      }
    }

    function toggleVideo() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    if (cover) {
      cover.addEventListener("click", playVideo);
    }
    if (sideButton) {
      sideButton.addEventListener("click", playVideo);
    }
    video.addEventListener("click", toggleVideo);
    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing", "is-started");
      }
    });
    video.addEventListener("pause", function () {
      if (shell) {
        shell.classList.remove("is-playing");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initVideoPlayer = initVideoPlayer;
})();
