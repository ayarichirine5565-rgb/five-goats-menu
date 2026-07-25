/* =========================================================
   FIVE GOATS COFFEE SHOP — Digital Menu
   Interaction layer: loader, sticky nav + scrollspy,
   scroll-reveal animations, parallax hero, back-to-top.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  var loader = document.getElementById("loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-hidden");
    setTimeout(function () { loader.remove(); }, 700);
  }
  if (document.readyState === "complete") {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener("load", function () {
      setTimeout(hideLoader, 400);
    });
    // Safety net in case load event is delayed
    setTimeout(hideLoader, 2200);
  }

  /* ---------- Sticky nav shadow/background on scroll ---------- */
  var siteNav = document.getElementById("siteNav");
  var lastScrollY = window.scrollY;
  function onScrollNav() {
    if (window.scrollY > 24) {
      siteNav.classList.add("is-scrolled");
    } else {
      siteNav.classList.remove("is-scrolled");
    }
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navAnchors
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll-reveal for cards & titles ---------- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(".category, .page-eyebrow"));
  if ("IntersectionObserver" in window && revealTargets.length) {
    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (t) { reveal.observe(t); });
  } else {
    revealTargets.forEach(function (t) { t.classList.add("in-view"); });
  }

  /* ---------- Gentle parallax on hero ---------- */
  var heroBg = document.getElementById("heroBg");
  var hero = document.querySelector(".hero");
  if (heroBg && hero && !reduceMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var progress = -rect.top / (rect.height || 1);
        heroBg.style.transform = "translateY(" + (progress * 60) + "px)";
      },
      { passive: true }
    );
  }

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 640) {
          backToTop.classList.add("is-visible");
        } else {
          backToTop.classList.remove("is-visible");
        }
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Smooth scroll for in-page anchors (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  });
})();
