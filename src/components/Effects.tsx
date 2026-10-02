'use client';

import { useEffect } from 'react';
import { initReveal } from '@/scripts/reveal';
import { initTitle } from '@/scripts/title';
import { initCommands } from '@/scripts/commands';
import { useInit } from '@/scripts/useInit';

/** Page-level enhancements that are not tied to one component. */
export function Effects() {
  useEffect(() => {
    initReveal();
    initTitle();
  }, []);
  const echo = useInit<HTMLParagraphElement>(initCommands);
  return <p className="cmd micro" ref={echo} aria-hidden="true" />;
}
