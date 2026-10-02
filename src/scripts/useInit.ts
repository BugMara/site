'use client';

import { useEffect, useRef } from 'react';

/**
 * Runs an interaction module once against a DOM element after mount.
 * Guarded with a data attribute so React Strict Mode's double effect never
 * installs a module twice (the modules attach window listeners by design).
 */
export function useInit<T extends HTMLElement>(init: (el: T) => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.init !== undefined) return;
    el.dataset.init = '';
    init(el);
  }, [init]);
  return ref;
}
