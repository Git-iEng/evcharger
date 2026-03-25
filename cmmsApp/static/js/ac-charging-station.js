/* ===================== DC HERO REVEAL (REPLAY ON SCROLL UP/DOWN) ===================== */
(function () {
  const els = document.querySelectorAll("[data-reveal-dc]");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview-dc");
        } else {
          // remove so it reveals again when scrolling back
          entry.target.classList.remove("is-inview-dc");
        }
      });
    },
    { threshold: 0.35 }
  );

  els.forEach((el) => io.observe(el));
})();
 (function () {
    const items = document.querySelectorAll(".our-reveal-all-products");
    if (!items.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      items.forEach(el => el.classList.add("is-inview-all-products"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview-all-products");
        } else {
          entry.target.classList.remove("is-inview-all-products");
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });

    items.forEach(el => io.observe(el));
  })();

  (() => {
  const section = document.querySelector(".js-revealwrap-all-products");
  if (!section) return;

  // Add stagger delays via JS (more reliable than CSS attr())
  const items = section.querySelectorAll(".js-reveal-all-products");
  items.forEach((el) => {
    const s = Number(el.getAttribute("data-stagger") || 0);
    el.style.transitionDelay = `${s * 90}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // When entering view -> animate in
        if (entry.isIntersecting) {
          section.classList.add("is-inview-all-products");
        } else {
          // Remove when leaving so it replays on scroll up/down
          section.classList.remove("is-inview-all-products");
          // reset delay timing so replay looks correct
          items.forEach((el) => {
            const s = Number(el.getAttribute("data-stagger") || 0);
            el.style.transitionDelay = `${s * 90}ms`;
          });
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  io.observe(section);
})();



(function () {
  const hero = document.querySelector("[data-prod-hero]");
  if (!hero) return;

  const slides = hero.querySelectorAll("[data-prod-slide]");
  const dots = hero.querySelectorAll("[data-prod-dot]");
  const intervalMs = 5500;
  let index = 0;
  let timer = null;

  function setReveal(slide){
    const items = slide.querySelectorAll("[data-prod-reveal]");
    items.forEach(el => el.classList.remove("is-visible"));

    items.forEach(el => {
      const delay = Number(el.getAttribute("data-delay") || "0");
      el.style.transitionDelay = delay + "ms";
      requestAnimationFrame(() => el.classList.add("is-visible"));
    });
  }

  function show(i){
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    index = i;
    setReveal(slides[i]);
  }

  function next(){
    show((index + 1) % slides.length);
  }

  function start(){
    stop();
    timer = setInterval(next, intervalMs);
  }

  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  // dot click
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const i = Number(dot.getAttribute("data-prod-dot"));
      show(i);
      start();
    });
  });

  // pause on hover
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);

  show(0);
  start();
})();