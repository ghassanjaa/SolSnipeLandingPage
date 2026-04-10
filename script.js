document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in-up');
  elementsToAnimate.forEach(el => observer.observe(el));

  // Some fun app interaction inside the mockup
  const scoreRingInner = document.querySelector('.ring-inner');
  if (scoreRingInner) {
    let score = 0;
    const interval = setInterval(() => {
      score += 2;
      if (score >= 98) {
        score = 98;
        clearInterval(interval);
      }
      scoreRingInner.textContent = score;
    }, 30);
  }
});
