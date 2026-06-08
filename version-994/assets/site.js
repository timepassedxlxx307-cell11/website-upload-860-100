(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-back-top]').forEach((button) => {
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const searchInput = document.querySelector('[data-search]');
  const clearButton = document.querySelector('[data-clear-search]');

  if (searchInput) {
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const applySearch = () => {
      const keyword = searchInput.value.trim().toLowerCase();
      cards.forEach((card) => {
        const text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        card.classList.toggle('hidden-by-filter', Boolean(keyword) && !text.includes(keyword));
      });
    };

    searchInput.addEventListener('input', applySearch);

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        applySearch();
        searchInput.focus();
      });
    }
  }

  document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));

    if (slides.length < 2) {
      return;
    }

    let active = 0;
    let timer = null;

    const show = (next) => {
      active = (next + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === active);
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === active);
      });
    };

    const start = () => {
      timer = window.setInterval(() => show(active + 1), 5200);
    };

    const restart = () => {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        show(index);
        restart();
      });
    });

    show(0);
    start();
  });
})();
