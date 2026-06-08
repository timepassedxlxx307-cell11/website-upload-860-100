(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var expanded = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
            button.textContent = expanded ? "☰" : "×";
        });
    }

    function setupHero() {
        var slider = document.querySelector(".hero-slider");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                var active = position === index;
                slide.classList.toggle("is-active", active);
                slide.setAttribute("aria-hidden", active ? "false" : "true");
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                show(position);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function filterCards(input, cards) {
        var term = normalize(input.value);
        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search") || card.textContent);
            card.classList.toggle("is-hidden", term && text.indexOf(term) === -1);
        });
    }

    function setupFilters() {
        var localInputs = Array.prototype.slice.call(document.querySelectorAll(".filter-input"));
        localInputs.forEach(function (input) {
            var scope = input.closest("main") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-grid article"));
            input.addEventListener("input", function () {
                filterCards(input, cards);
            });
        });
        var searchInput = document.querySelector(".search-page-input");
        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            var searchCards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid article"));
            searchInput.value = query;
            filterCards(searchInput, searchCards);
            searchInput.addEventListener("input", function () {
                filterCards(searchInput, searchCards);
            });
        }
    }

    function setupPlayers() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        panels.forEach(function (panel) {
            var video = panel.querySelector("video");
            var cover = panel.querySelector(".player-cover");
            var started = false;
            var hls = null;
            if (!video || !cover) {
                return;
            }

            function getUrl() {
                var source = video.querySelector("source");
                return source ? source.getAttribute("src") : video.getAttribute("src");
            }

            function bindSource() {
                var url = getUrl();
                if (!url || started) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
                started = true;
            }

            function play() {
                bindSource();
                panel.classList.add("is-playing");
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {
                        panel.classList.remove("is-playing");
                    });
                }
            }

            cover.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
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
})();
