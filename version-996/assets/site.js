(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        menu.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;

      function showSlide(next) {
        if (!slides.length) {
          return;
        }
        current = (next + slides.length) % slides.length;
        slides.forEach(function (slide, index) {
          slide.classList.toggle("active", index === current);
        });
        dots.forEach(function (dot, index) {
          dot.classList.toggle("active", index === current);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var searchForms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
    searchForms.forEach(function (form) {
      var input = form.querySelector("[data-search-input]");
      var scope = form.closest("main") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });

      if (!input || !cards.length) {
        return;
      }

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-title") || card.textContent || "").toLowerCase();
          card.hidden = query.length > 0 && haystack.indexOf(query) === -1;
        });
      });
    });

    var filterRows = Array.prototype.slice.call(document.querySelectorAll("[data-filter-row]"));
    filterRows.forEach(function (row) {
      var buttons = Array.prototype.slice.call(row.querySelectorAll("[data-filter]"));
      var section = row.closest("section") || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var value = button.getAttribute("data-filter") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          cards.forEach(function (card) {
            var kind = card.getAttribute("data-kind") || "";
            card.hidden = value !== "all" && kind.indexOf(value) === -1;
          });
        });
      });
    });

    var player = document.querySelector("[data-player]");
    if (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var attached = false;

      function attachStream() {
        if (!video || attached) {
          return;
        }
        var stream = video.getAttribute("data-stream");
        if (!stream) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          attached = true;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          attached = true;
        } else {
          video.src = stream;
          attached = true;
        }
      }

      function startVideo() {
        attachStream();
        if (!video) {
          return;
        }
        player.classList.add("is-playing");
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", startVideo);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            startVideo();
          }
        });
        video.addEventListener("play", function () {
          player.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
          player.classList.remove("is-playing");
        });
      }
    }
  });
})();
