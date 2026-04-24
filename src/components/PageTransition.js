'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 400, easing: 'ease-out' }
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
