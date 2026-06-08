document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    var topButton = document.querySelector("[data-back-top]");

    if (topButton) {
        window.addEventListener("scroll", function () {
            topButton.classList.toggle("is-visible", window.scrollY > 500);
        });
        topButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var active = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }
    });

    var urlQuery = new URLSearchParams(window.location.search).get("q") || "";

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        var section = panel.parentElement;
        var grid = section.querySelector("[data-card-grid]");
        if (!grid) {
            grid = document.querySelector("[data-card-grid]");
        }
        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
        var search = panel.querySelector("[data-search-input]");
        var typeSelect = panel.querySelector("[data-filter-type]");
        var regionSelect = panel.querySelector("[data-filter-region]");
        var yearSelect = panel.querySelector("[data-filter-year]");
        var sortSelect = panel.querySelector("[data-sort]");
        var empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "没有找到匹配影片";
        grid.parentNode.insertBefore(empty, grid.nextSibling);

        if (search && urlQuery) {
            search.value = urlQuery;
        }

        function normalize(text) {
            return String(text || "").toLowerCase().trim();
        }

        function cardText(card) {
            return [
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" ").toLowerCase();
        }

        function apply() {
            var keyword = normalize(search ? search.value : "");
            var typeValue = typeSelect ? typeSelect.value : "";
            var regionValue = regionSelect ? regionSelect.value : "";
            var yearValue = yearSelect ? yearSelect.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var matched = true;
                if (keyword && cardText(card).indexOf(keyword) === -1) {
                    matched = false;
                }
                if (typeValue && card.getAttribute("data-type") !== typeValue) {
                    matched = false;
                }
                if (regionValue && card.getAttribute("data-region") !== regionValue) {
                    matched = false;
                }
                if (yearValue && card.getAttribute("data-year") !== yearValue) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            empty.classList.toggle("is-visible", visible === 0);
        }

        function sortCards() {
            var mode = sortSelect ? sortSelect.value : "default";
            var sorted = cards.slice();
            if (mode === "rating") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
                });
            } else if (mode === "heat") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-heat")) - Number(a.getAttribute("data-heat"));
                });
            } else if (mode === "year") {
                sorted.sort(function (a, b) {
                    return String(b.getAttribute("data-year")).localeCompare(String(a.getAttribute("data-year")));
                });
            } else {
                sorted.sort(function (a, b) {
                    return cards.indexOf(a) - cards.indexOf(b);
                });
            }
            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
            apply();
        }

        [search, typeSelect, regionSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        if (sortSelect) {
            sortSelect.addEventListener("change", sortCards);
        }

        sortCards();
    });
});
