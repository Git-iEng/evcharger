(function () {
  const hero = document.querySelector(".hero-all-products");
  if (!hero) return;

  // Wait one frame so transitions apply
  requestAnimationFrame(() => {
    hero.classList.add("is-ready-all-products");
  });
})();
(function () {
  const section = document.querySelector("[data-basic-solution-heading]");
  if (!section) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    section.classList.add("is-inview-bsh");
    return;
  }

  // Apply delay values as CSS variables
  section.querySelectorAll("[data-bsh-reveal]").forEach((el) => {
    const d = parseInt(el.getAttribute("data-delay") || "0", 10);
    el.style.setProperty("--bsh-delay", `${d}ms`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("is-inview-bsh");
        } else {
          // reset so it replays when scrolling up/down again
          section.classList.remove("is-inview-bsh");
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
  );

  io.observe(section);
})();
// Optional: makes hover animation work nicely on keyboard focus + touch
(function () {
  const cards = document.querySelectorAll(".feature-card-all-products");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("focusin", () => card.classList.add("is-hover-all-products"));
    card.addEventListener("focusout", () => card.classList.remove("is-hover-all-products"));

    // Touch support: tap to preview hover, tap again to follow link
    let tapped = false;
    card.addEventListener("touchstart", (e) => {
      if (!tapped) {
        tapped = true;
        card.classList.add("is-hover-all-products");
        setTimeout(() => (tapped = false), 600);
        // prevent immediate navigation on first tap
        e.preventDefault();
      }
    }, { passive: false });
  });
})();
(() => {
  const section = document.querySelector(".js-ourwork-all-products");
  if (!section) return;

  // apply per-element delay from data-delay
  section.querySelectorAll("[data-reveal]").forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.transitionDelay = `${Number(d)}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // add on enter, remove on exit => replays on scroll up/down
        if (entry.isIntersecting) {
          section.classList.add("is-inview-all-products");
        } else {
          section.classList.remove("is-inview-all-products");
        }
      });
    },
    { threshold: 0.35 }
  );

  io.observe(section);
})();

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-slider-all-products");
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll(".hero-slide-all-products"));
  if (slides.length < 2) return;

  let index = 0;
  const intervalMs = 3500; // change timing if you want

  // If user prefers reduced motion, do not auto-rotate
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  setInterval(() => {
    slides[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
  }, intervalMs);
});


(function () {
  const root = document.querySelector('[data-products-hero]');
  if (!root) return;

  const slides = [...root.querySelectorAll('[data-products-slide]')];
  const dots = [...root.querySelectorAll('[data-products-dot]')];

  let index = 0;
  let timer = null;

  function setReveal(slide) {
    const items = slide.querySelectorAll('.products-hero__reveal');
    items.forEach(el => el.classList.remove('is-visible'));

    // trigger reflow so animation replays
    void slide.offsetWidth;

    items.forEach(el => {
      const delay = el.getAttribute('data-delay') || '0';
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add('is-visible');
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;

    slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === index));

    setReveal(slides[index]);
  }

  function next() { goTo(index + 1); }

  function start() {
    stop();
    timer = setInterval(next, 3000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((btn) => {
    btn.addEventListener('click', () => {
      goTo(parseInt(btn.dataset.productsDot, 10));
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // init
  goTo(0);
  start();
})();


(function () {
  const root = document.querySelector('[data-prod-hero]');
  if (!root) return;

  const slides = [...root.querySelectorAll('[data-prod-slide]')];
  const dots = [...root.querySelectorAll('[data-prod-dot]')];
  const total = slides.length;

  let index = 0;
  let timer = null;

  function setReveals(activeSlide) {
    const revealEls = activeSlide.querySelectorAll('[data-prod-reveal]');
    revealEls.forEach(el => {
      el.classList.remove('is-visible');
      const delay = Number(el.getAttribute('data-delay') || 0);
      el.style.transitionDelay = `${delay}ms`;
    });

    // next frame so transitions run
    requestAnimationFrame(() => {
      revealEls.forEach(el => el.classList.add('is-visible'));
    });
  }

  function goTo(i) {
    index = (i + total) % total;

    slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === index));

    setReveals(slides[index]);
  }

  function start() {
    stop();
    timer = setInterval(() => goTo(index + 1), 3000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach(btn => {
    btn.addEventListener('click', () => {
      goTo(Number(btn.getAttribute('data-prod-dot')));
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  goTo(0);
  start();
})();