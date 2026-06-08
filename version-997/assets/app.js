(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-search-input]');
      var region = scope.querySelector('[data-region-filter]');
      var year = scope.querySelector('[data-year-filter]');
      var category = scope.querySelector('[data-category-filter]');
      var empty = scope.querySelector('[data-filter-empty]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function matchesYear(cardYear, filterYear) {
        if (!filterYear) {
          return true;
        }
        if (filterYear === '2010') {
          return /^201/.test(cardYear);
        }
        if (filterYear === '2000') {
          return /^200/.test(cardYear);
        }
        return cardYear.indexOf(filterYear) !== -1;
      }

      function apply() {
        var q = normalize(input && input.value);
        var regionValue = normalize(region && region.value);
        var yearValue = normalize(year && year.value);
        var categoryValue = normalize(category && category.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-text'));
          var cardRegion = normalize(card.getAttribute('data-region'));
          var cardYear = normalize(card.getAttribute('data-year'));
          var cardCategory = normalize(card.getAttribute('data-category'));
          var ok = true;

          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (regionValue && cardRegion.indexOf(regionValue) === -1 && text.indexOf(regionValue) === -1) {
            ok = false;
          }
          if (!matchesYear(cardYear, yearValue)) {
            ok = false;
          }
          if (categoryValue && cardCategory.indexOf(categoryValue) === -1) {
            ok = false;
          }

          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, region, year, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var trigger = player.querySelector('[data-play-trigger]');
      var status = player.querySelector('[data-player-status]');
      var stream = player.getAttribute('data-stream');
      var hls = null;

      if (!video || !trigger || !stream) {
        return;
      }

      function setStatus(text) {
        if (status) {
          status.textContent = text || '';
        }
      }

      function load() {
        if (video.dataset.ready === '1') {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.dataset.ready = '1';
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              setStatus('播放失败，请稍后重试');
            }
          });
          video.dataset.ready = '1';
          return;
        }

        setStatus('播放失败，请稍后重试');
      }

      function start() {
        load();
        trigger.classList.add('is-hidden');
        player.classList.add('is-playing');
        video.controls = true;
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            trigger.classList.remove('is-hidden');
          });
        }
      }

      trigger.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (video.paused || video.dataset.ready !== '1') {
          start();
        }
      });
      window.addEventListener('pagehide', function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
}());
