(function () {
  const mobileToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const homeForm = document.querySelector('[data-home-search-form]');

  if (homeForm) {
    homeForm.addEventListener('submit', function (event) {
      const input = homeForm.querySelector('[data-home-search]');
      const value = input ? input.value.trim() : '';
      if (value) {
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(value);
      }
    });
  }

  const searchInput = document.querySelector('[data-search]');
  const yearFilter = document.querySelector('[data-filter-year]');
  const regionFilter = document.querySelector('[data-filter-region]');
  const genreFilter = document.querySelector('[data-filter-genre]');
  const cardList = document.querySelector('[data-card-list]');
  const emptyState = document.querySelector('[data-empty-state]');

  if (cardList) {
    const cards = Array.from(cardList.querySelectorAll('.movie-card'));
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query && searchInput) {
      searchInput.value = query;
    }

    const applyFilters = function () {
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const year = yearFilter ? yearFilter.value : '';
      const region = regionFilter ? regionFilter.value : '';
      const genre = genreFilter ? genreFilter.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const title = (card.dataset.title || '').toLowerCase();
        const cardYear = card.dataset.year || '';
        const cardRegion = card.dataset.region || '';
        const cardGenre = card.dataset.genre || '';
        const cardTags = card.dataset.tags || '';
        const haystack = [title, cardRegion, cardYear, cardGenre, cardTags].join(' ').toLowerCase();
        const matched = (!keyword || haystack.indexOf(keyword) !== -1) && (!year || cardYear === year) && (!region || cardRegion.indexOf(region) !== -1) && (!genre || cardGenre.indexOf(genre) !== -1 || cardTags.indexOf(genre) !== -1);

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    };

    [searchInput, yearFilter, regionFilter, genreFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach(function (box) {
    const video = box.querySelector('video');
    const button = box.querySelector('[data-play]');

    if (!video || !button) {
      return;
    }

    const stream = video.getAttribute('data-stream');
    let loaded = false;
    let hlsInstance = null;

    const loadVideo = function () {
      if (!stream) {
        return;
      }

      if (!loaded) {
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      video.controls = true;
      box.classList.add('is-started');
      const promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    };

    button.addEventListener('click', loadVideo);

    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        loadVideo();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
