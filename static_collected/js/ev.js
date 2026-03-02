(() => {
  const root = document.querySelector("[data-home-ev-slider]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-dot]"));

  let index = Math.max(0, slides.findIndex(s => s.classList.contains("is-active")));
  let timer = null;
  let inView = false;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setDotActive(i) {
    dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
  }

  function resetReveal(slideEl) {
    slideEl.querySelectorAll("[data-reveal]").forEach(el => {
      el.classList.remove("is-visible");
      el.style.transitionDelay = "0ms";
    });
  }

  function playReveal(slideEl) {
    const items = Array.from(slideEl.querySelectorAll("[data-reveal]"));

    items.forEach(el => {
      el.classList.remove("is-visible");
      const delay = parseInt(el.getAttribute("data-delay") || "0", 10);
      el.style.transitionDelay = `${delay}ms`;
    });

    // force reflow so animation restarts
    // eslint-disable-next-line no-unused-expressions
    slideEl.offsetHeight;

    requestAnimationFrame(() => {
      items.forEach(el => el.classList.add("is-visible"));
    });
  }

  function showInstant(slideEl) {
    slideEl.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
  }

  function goTo(i) {
    const nextIndex = (i + slides.length) % slides.length;
    if (nextIndex === index) return;

    slides[index].classList.remove("is-active");
    resetReveal(slides[index]);

    slides[nextIndex].classList.add("is-active");
    index = nextIndex;

    setDotActive(index);

    if (!inView) return;

    if (reduceMotion) showInstant(slides[index]);
    else playReveal(slides[index]);
  }

  function next() { goTo(index + 1); }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = window.setInterval(next, 4000);
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Replay on scroll up/down (out -> in)
  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      inView = !!entry.isIntersecting;

      if (inView) {
        if (reduceMotion) showInstant(slides[index]);
        else playReveal(slides[index]);
        startAutoplay();
      } else {
        // reset so it replays when you come back
        resetReveal(slides[index]);
        stopAutoplay();
      }
    },
    { threshold: 0.35 }
  );

  io.observe(root);

  // Dots click
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = parseInt(dot.getAttribute("data-dot"), 10);
      stopAutoplay();
      goTo(i);
      startAutoplay();
    });
  });

  // Pause on hover
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);
})();
(() => {
  const marquees = document.querySelectorAll("[data-marquee]");
  if (!marquees.length) return;

  const PX_PER_SEC = 110; // speed (increase = faster)

  function setupMarquee(marqueeEl) {
    const track = marqueeEl.querySelector("[data-marquee-track]");
    const train = marqueeEl.querySelector("[data-marquee-train]");
    const clone = marqueeEl.querySelector("[data-marquee-clone]");
    if (!track || !train || !clone) return;

    // Put the same content into the clone
    clone.innerHTML = train.innerHTML;

    // Remove any extra clones from previous runs
    Array.from(track.querySelectorAll("[data-marquee-extra]")).forEach(el => el.remove());

    // Measure
    const marqueeWidth = marqueeEl.getBoundingClientRect().width;
    const trainWidth = train.getBoundingClientRect().width;

    // Make sure we have enough content to cover 2x viewport
    // (prevents empty area on large screens)
    let totalWidth = trainWidth * 2; // original + clone
    while (totalWidth < marqueeWidth * 2) {
      const extra = train.cloneNode(true);
      extra.setAttribute("aria-hidden", "true");
      extra.setAttribute("data-marquee-extra", "true");
      track.appendChild(extra);
      totalWidth += trainWidth;
    }

    // Set shift distance = width of one train
    track.style.setProperty("--marquee-shift", `${trainWidth}px`);

    // Duration based on speed
    const duration = Math.max(6, trainWidth / PX_PER_SEC);
    track.style.setProperty("--marquee-duration", `${duration}s`);
  }

  // Init + resize
  marquees.forEach(setupMarquee);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => marquees.forEach(setupMarquee), 150);
  });
})();
(() => {
  const section = document.querySelector("[data-about-reveal]");
  if (!section) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = Array.from(section.querySelectorAll("[data-reveal]"));

  function reset() {
    section.classList.remove("is-inview");
    revealEls.forEach(el => el.classList.remove("is-visible"));
  }

  function play() {
    section.classList.add("is-inview");

    if (reduceMotion) {
      revealEls.forEach(el => el.classList.add("is-visible"));
      return;
    }

    // reveal text with delays
    revealEls.forEach(el => {
      const delay = parseInt(el.getAttribute("data-delay") || "0", 10);
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-visible");
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // restart clean for consistent animation
        reset();
        // small tick so CSS can reset
        requestAnimationFrame(() => play());
      } else {
        // remove to replay on scroll back
        reset();
      }
    },
    { threshold: 0.35 }
  );

  io.observe(section);
})();
(() => {
  const cards = Array.from(document.querySelectorAll("[data-service-card]"));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // strengths
  const MOUSE_PX = 10;   // move range on mouse
  const SCROLL_PX = 18;  // move range on scroll

  const state = new Map();

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function setVars(card, mx, my, sy){
    card.style.setProperty("--mx", `${mx.toFixed(2)}px`);
    card.style.setProperty("--my", `${my.toFixed(2)}px`);
    card.style.setProperty("--sy", `${sy.toFixed(2)}px`);
  }

  // init state
  cards.forEach(card => {
    state.set(card, { mx: 0, my: 0, sy: 0, raf: null });
    setVars(card, 0, 0, 0);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clamp((e.clientX - cx) / (rect.width / 2), -1, 1);
      const dy = clamp((e.clientY - cy) / (rect.height / 2), -1, 1);

      const st = state.get(card);
      st.mx = dx * MOUSE_PX;
      st.my = dy * MOUSE_PX;

      if (!st.raf) {
        st.raf = requestAnimationFrame(() => {
          st.raf = null;
          setVars(card, st.mx, st.my, st.sy);
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      const st = state.get(card);
      st.mx = 0; st.my = 0;

      if (!st.raf) {
        st.raf = requestAnimationFrame(() => {
          st.raf = null;
          setVars(card, st.mx, st.my, st.sy);
        });
      }
    });
  });

  // scroll parallax (small vertical drift)
  function onScroll(){
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // progress: -1 (above) to +1 (below)
      const progress = clamp(((rect.top + rect.height/2) - vh/2) / (vh/2), -1, 1);

      const st = state.get(card);
      st.sy = -progress * SCROLL_PX;

      if (!st.raf) {
        st.raf = requestAnimationFrame(() => {
          st.raf = null;
          setVars(card, st.mx, st.my, st.sy);
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
(() => {
  const section = document.querySelector("[data-service-reveal]");
  if (!section) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const headerReveals = Array.from(section.querySelectorAll("[data-reveal]"));
  const items = Array.from(section.querySelectorAll("[data-service-item]"));
  const itemLinks = Array.from(section.querySelectorAll(".service-item-link"));

  function reset() {
    section.classList.remove("is-inview");

    headerReveals.forEach(el => el.classList.remove("is-visible"));
    items.forEach(el => el.classList.remove("is-visible"));
    itemLinks.forEach(a => a.classList.remove("is-visible"));
  }

  function play() {
    section.classList.add("is-inview");

    if (reduceMotion) {
      headerReveals.forEach(el => el.classList.add("is-visible"));
      items.forEach(el => el.classList.add("is-visible"));
      itemLinks.forEach(a => a.classList.add("is-visible"));
      return;
    }

    // header
    headerReveals.forEach(el => {
      const d = parseInt(el.getAttribute("data-delay") || "0", 10);
      el.style.transitionDelay = `${d}ms`;
      el.classList.add("is-visible");
    });

    // list rows (stagger)
    items.forEach((row, idx) => {
      const d = parseInt(row.getAttribute("data-delay") || String(idx * 120), 10);
      row.style.transitionDelay = `${d}ms`;
      row.classList.add("is-visible");

      // also mark link for image reveal
      const link = row.closest(".service-item-link");
      if (link) {
        link.style.transitionDelay = `${d}ms`;
        link.classList.add("is-visible");
      }
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        reset();
        requestAnimationFrame(() => play());
      } else {
        reset();
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -15% 0px"
    }
  );

  io.observe(section);

  // if page loads already near this section (mobile)
  requestAnimationFrame(() => {
    const r = section.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      reset();
      play();
    }
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".home-one-protest-section");
  if (!section) return;

  const imgWrap1 = section.querySelector(".image-effect-wrapper-one");
  const imgWrap2 = section.querySelector(".image-effect-wrapper-two");
  if (!imgWrap1 || !imgWrap2) return;

  const img2 = imgWrap2.querySelector(".image-effect");

  const reset = () => {
    section.classList.remove("is-inview");
    imgWrap1.classList.remove("is-revealed");
    imgWrap2.classList.remove("is-revealed", "is-badge-visible");

    // force reflow so reveal replays next time
    void section.offsetHeight;
  };

  const start = () => {
    section.classList.add("is-inview");

    // reveal images sequentially (green -> image)
    setTimeout(() => imgWrap1.classList.add("is-revealed"), 120);
    setTimeout(() => imgWrap2.classList.add("is-revealed"), 280);

    // show badge only after second image reveal completes
    const showBadge = () => imgWrap2.classList.add("is-badge-visible");

    // Prefer real transition end
    if (img2) {
      const onEnd = (e) => {
        if (e.propertyName === "clip-path") {
          img2.removeEventListener("transitionend", onEnd);
          showBadge();
        }
      };
      img2.addEventListener("transitionend", onEnd);

      // fallback (in case clip-path transitionend doesn't fire on some browsers)
      setTimeout(showBadge, 1300);
    } else {
      setTimeout(showBadge, 1300);
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      const ent = entries[0];
      if (ent.isIntersecting) start();
      else reset();
    },
    { threshold: 0.35 }
  );

  io.observe(section);
});
document.querySelectorAll(".home-one-protest-section").forEach((sec) => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) sec.classList.add("is-inview");
        else sec.classList.remove("is-inview"); // replay when scrolling back
      });
    },
    { threshold: 0.35 }
  );

  io.observe(sec);
});
const protest = document.querySelectorAll('.home-one-protest-section');

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('is-inview');
    else e.target.classList.remove('is-inview'); // so it replays on scroll up/down
  });
}, { threshold: 0.35 });

protest.forEach((s) => io.observe(s));
/* ===================== EV BLOGS REVEAL (replay on scroll up/down) ===================== */
(function () {
  const items = document.querySelectorAll("[data-reveal-ev-blogs]");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview-ev-blogs");
        } else {
          /* remove when leaving so it re-animates when scrolling back */
          entry.target.classList.remove("is-inview-ev-blogs");
        }
      });
    },
    { threshold: 0.22 }
  );

  items.forEach((el) => io.observe(el));
})();
