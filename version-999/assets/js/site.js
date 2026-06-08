(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    var search = document.querySelector('.nav-search');

    if (toggle && menu && search) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
            search.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var queryInput = document.querySelector('[data-page-filter]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }
        var query = normalize(queryInput ? queryInput.value : '');
        var typeValue = normalize(typeSelect ? typeSelect.value : '');
        var yearValue = normalize(yearSelect ? yearSelect.value : '');
        var shown = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-search'));
            var ok = true;
            if (query && haystack.indexOf(query) === -1) {
                ok = false;
            }
            if (typeValue && haystack.indexOf(typeValue) === -1) {
                ok = false;
            }
            if (yearValue && haystack.indexOf(yearValue) === -1) {
                ok = false;
            }
            card.style.display = ok ? '' : 'none';
            if (ok) {
                shown += 1;
            }
        });

        if (empty) {
            empty.style.display = shown ? 'none' : 'block';
        }
    }

    if (queryInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            queryInput.value = q;
        }
        queryInput.addEventListener('input', filterCards);
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', filterCards);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', filterCards);
    }

    filterCards();
}());
