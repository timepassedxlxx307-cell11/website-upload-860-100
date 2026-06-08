(function () {
    function select(selector, root) {
        return (root || document).querySelector(selector);
    }

    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = select('.menu-button');
        var nav = select('.mobile-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function initHeroSlider() {
        var slides = selectAll('.hero-slide');
        if (!slides.length) {
            return;
        }
        var dots = selectAll('.hero-dot');
        var prev = select('.hero-prev');
        var next = select('.hero-next');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                show(itemIndex);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }
        restart();
    }

    function initFilters() {
        var grid = select('.filter-grid');
        if (!grid) {
            return;
        }
        var keyword = select('#filter-keyword');
        var type = select('#filter-type');
        var category = select('#filter-category');
        var year = select('#filter-year');
        var cards = selectAll('.movie-card', grid);

        function valueOf(input) {
            return input ? input.value.trim().toLowerCase() : '';
        }

        function update() {
            var keywordValue = valueOf(keyword);
            var typeValue = valueOf(type);
            var categoryValue = valueOf(category);
            var yearValue = valueOf(year);
            cards.forEach(function (card) {
                var meta = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta')).toLowerCase();
                var matchKeyword = !keywordValue || meta.indexOf(keywordValue) !== -1;
                var matchType = !typeValue || (card.getAttribute('data-type') || '').toLowerCase() === typeValue;
                var matchCategory = !categoryValue || (card.getAttribute('data-category') || '').toLowerCase() === categoryValue;
                var matchYear = !yearValue || (card.getAttribute('data-year') || '').toLowerCase() === yearValue;
                card.classList.toggle('is-hidden', !(matchKeyword && matchType && matchCategory && matchYear));
            });
        }

        [keyword, type, category, year].forEach(function (input) {
            if (input) {
                input.addEventListener('input', update);
                input.addEventListener('change', update);
            }
        });
    }

    function initAnchorScroll() {
        selectAll('.scroll-player').forEach(function (link) {
            link.addEventListener('click', function () {
                var mask = select('.play-mask');
                if (mask) {
                    window.setTimeout(function () {
                        mask.focus();
                    }, 300);
                }
            });
        });
    }

    window.initMoviePlayer = function (sourceUrl) {
        var video = select('.movie-video');
        var mask = select('.play-mask');
        if (!video || !mask || !sourceUrl) {
            return;
        }
        var ready = false;
        var hlsInstance = null;

        function attach() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = sourceUrl;
        }

        function play() {
            attach();
            video.setAttribute('controls', 'controls');
            mask.classList.add('is-playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    mask.classList.remove('is-playing');
                });
            }
        }

        mask.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            mask.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                mask.classList.remove('is-playing');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHeroSlider();
        initFilters();
        initAnchorScroll();
    });
})();
