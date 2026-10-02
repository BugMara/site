'use client';

import { useEffect } from 'react';
import { initReveal } from '@/scripts/reveal';

/** Page-level enhancements that are not tied to one component. Renders nothing. */
export function Effects() {
  useEffect(() => initReveal(), []);
  return null;
}
