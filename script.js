document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Intersection Observer for scroll animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal-on-scroll, .fade-in-up").forEach(el => observer.observe(el));

  // ── Navbar scroll effect ──
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = scrollY;
  }, { passive: true });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      const navLinks = document.getElementById("navLinks");
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // ── Mobile menu toggle ──
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });
  }

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".stat-number").forEach(el => counterObserver.observe(el));

  // ── Score gauge animation ──
  const gaugeNumber = document.querySelector(".gauge-number");
  const gauge = document.getElementById("scoreGauge");
  if (gaugeNumber && gauge) {
    const gaugeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(gaugeNumber.dataset.target || "92");
          const duration = 2500;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(eased * target);
            gaugeNumber.textContent = current;
            gauge.style.background = `conic-gradient(var(--sol-green) ${eased * target}%, rgba(255,255,255,0.05) 0%)`;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    gaugeObserver.observe(gauge);
  }

  // ── Cursor glow effect ──
  if (!prefersReducedMotion) {
    const cursorGlow = document.getElementById("cursorGlow");
    if (cursorGlow && window.innerWidth > 768) {
      document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
      }, { passive: true });
    }

    // ── Parallax effect on phone mockups ──
    const heroSection = document.getElementById("hero");
    const phones = document.querySelectorAll(".phone-mockup");
    if (heroSection && phones.length) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        phones.forEach((phone, i) => {
          const intensity = i === 0 ? 10 : 6;
          phone.style.transform = phone.classList.contains("center")
            ? `rotateY(${-15 + x * intensity}deg) rotateX(${5 + y * intensity}deg) translateX(${-x * 5}px)`
            : `rotateY(${-20 + x * intensity}deg) rotateX(${10 + y * intensity}deg) translateZ(-100px) translateX(${-x * 3}px)`;
        });
      });

      heroSection.addEventListener("mouseleave", () => {
        phones.forEach(phone => {
          phone.style.transform = "";
        });
      });
    }
  }
});