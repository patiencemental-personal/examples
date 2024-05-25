import { useState, useCallback, useEffect } from 'react';

export default function useWindowResize() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const handleResize = useCallback(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  })

  return viewportWidth;
}