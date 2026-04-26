import { useRef, useEffect } from 'react';
import gsap from '../lib/gsap';

export function useMagnet(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.willChange = 'transform';

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        ease: 'power3.out',
        duration: 0.4,
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, ease: 'elastic.out(1, 0.4)', duration: 0.7 });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
