(function () {
  "use strict";

  /* ── Safe wrapper ── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[MJ:" + name + "]", e); }
  }

  /* ── Sticky header ── */
  function initHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav ── */
  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var navMain = document.getElementById("nav-main");
    if (!toggle || !navMain) return;

    toggle.addEventListener("click", function () {
      var isOpen = navMain.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    /* Dropdowns */
    var items = document.querySelectorAll(".nav-item.has-dropdown");
    items.forEach(function (item) {
      var btn = item.querySelector(".nav-link");
      if (!btn) return;

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = item.classList.toggle("open");
        /* close others */
        items.forEach(function (other) {
          if (other !== item) other.classList.remove("open");
        });
      });
    });

    /* Close on outside click */
    document.addEventListener("click", function () {
      items.forEach(function (item) { item.classList.remove("open"); });
    });

    /* Close on ESC */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        items.forEach(function (item) { item.classList.remove("open"); });
        navMain.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ── Smooth scroll for anchors ── */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navH = 80;
      var top = el.getBoundingClientRect().top + window.scrollY - navH;
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ── Scroll reveal ── */
  function initReveal() {
    var els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -2% 0px" });

    els.forEach(function (el) { io.observe(el); });

    /* Safety: reveal any still hidden after 6s */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible)")
        .forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("is-visible");
          }
        });
    }, 6000);
  }

  /* ── Count-up ── */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count-to]");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count-to"), 10);
        var suffix = el.getAttribute("data-count-suffix") || "";
        var duration = 1600;
        var start = performance.now();
        function frame(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (t < 1) requestAnimationFrame(frame);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── FAQ Accordion ── */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  /* ── Contact forms ── */
  function initForms() {
    document.querySelectorAll("form[data-contact]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("[type=submit]");
        if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }

        /* Simulate send (replace with Formspree or similar) */
        setTimeout(function () {
          var success = form.parentElement.querySelector(".form-success");
          if (success) {
            form.style.display = "none";
            success.style.display = "block";
          } else {
            alert("✅ Mensaje enviado. En breve nos ponemos en contacto.");
            form.reset();
            if (btn) { btn.disabled = false; btn.textContent = "Enviar consulta"; }
          }
        }, 900);
      });
    });
  }

  /* ── Back to top ── */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── Hero parallax (subtle) ── */
  function initHeroParallax() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      hero.style.backgroundPositionY = (y * 0.3) + "px";
    }, { passive: true });
  }

  /* ── Boot ── */
  function boot() {
    safe(initHeader, "initHeader");
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveal, "initReveal");
    safe(initCountUp, "initCountUp");
    safe(initFaq, "initFaq");
    safe(initForms, "initForms");
    safe(initBackToTop, "initBackToTop");
    safe(initHeroParallax, "initHeroParallax");

    /* GSAP ScrollTrigger for enhanced effects if available */
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
