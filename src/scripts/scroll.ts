import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 767px)').matches;

if (!reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  if (!isMobile) {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      overscroll: false,
      anchors: true,
      prevent: (node) => node instanceof Element && Boolean(node.closest('#service-carousel')),
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    window.requestAnimationFrame(raf);
  }

  gsap.set('[data-reveal]', { autoAlpha: 0, y: 32 });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (elements) => {
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        overwrite: true,
      });
    },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
