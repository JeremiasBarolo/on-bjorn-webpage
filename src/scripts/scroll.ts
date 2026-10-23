const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" },
        );
      }),
    { threshold: 0.12 },
  );
  elements.forEach((element) => observer.observe(element));
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      document.getAnimations().forEach((animation) => animation.cancel());
    }
  });
}
