'use client';

import { useEffect, useState } from 'react';

export function useSafeMode() {
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    try {
      setSafe(new URLSearchParams(window.location.search).has('safe'));
    } catch {
      // ignore
    }
  }, []);

  return safe;
}
