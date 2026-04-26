import { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

export function use3DTilt(strength = 12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(el, {
        rotateY: dx * strength,
        rotateX: -dy * strength,
        transformPerspective: 900,
        ease: 'power2.out',
        duration: 0.35,
      });
    };

    const onEnter = () => {
      gsap.to(el, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(el, {
        rotateY: 0, rotateX: 0, scale: 1,
        ease: 'elastic.out(1, 0.5)',
        duration: 0.7,
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
