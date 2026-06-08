(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "×" : "☰";
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function startSlides() {
      if (slides.length < 2) {
        return;
      }
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide-target") || 0));
        startSlides();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        startSlides();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startSlides();
      });
    }

    startSlides();

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".local-search, .global-search"));
    var tagButtons = Array.prototype.slice.call(document.querySelectorAll(".tag-filter"));
    var clearButton = document.querySelector(".clear-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-list .movie-card"));
    var empty = document.querySelector(".empty-state");
    var currentTag = "";

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
      if (!cards.length) {
        return;
      }
      var query = normalize(searchInputs[0] ? searchInputs[0].value : "");
      var tag = normalize(currentTag);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-summary")
        ].join(" "));
        var tagText = normalize(card.getAttribute("data-tags"));
        var matched = (!query || haystack.indexOf(query) !== -1) && (!tag || tagText.indexOf(tag) !== -1);
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("visible", visible === 0);
      }
    }

    if (cards.length) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";
      var tag = params.get("tag") || "";
      searchInputs.forEach(function (input) {
        if (q) {
          input.value = q;
        }
        input.addEventListener("input", filterCards);
        if (input.form) {
          input.form.addEventListener("submit", function (event) {
            event.preventDefault();
            filterCards();
          });
        }
      });
      if (tag) {
        currentTag = tag;
      }
      tagButtons.forEach(function (button) {
        if (normalize(button.getAttribute("data-tag")) === normalize(currentTag)) {
          button.classList.add("active");
        }
        button.addEventListener("click", function () {
          var value = button.getAttribute("data-tag") || "";
          currentTag = normalize(currentTag) === normalize(value) ? "" : value;
          tagButtons.forEach(function (item) {
            item.classList.toggle("active", normalize(item.getAttribute("data-tag")) === normalize(currentTag));
          });
          filterCards();
        });
      });
      if (clearButton) {
        clearButton.addEventListener("click", function () {
          currentTag = "";
          searchInputs.forEach(function (input) {
            input.value = "";
          });
          tagButtons.forEach(function (button) {
            button.classList.remove("active");
          });
          filterCards();
        });
      }
      filterCards();
    }
  });
})();
