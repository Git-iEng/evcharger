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
