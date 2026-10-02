'use client';

import { useEffect } from 'react';
import { initReveal } from '@/scripts/reveal';
import { initTitle } from '@/scripts/title';
import { initCommands } from '@/scripts/commands';
import { initSleep } from '@/scripts/sleep';
import { initVisits } from '@/scripts/visits';
import { initManifesto } from '@/scripts/manifesto';
import { initBelow } from '@/scripts/below';
import { useInit } from '@/scripts/useInit';

/** Page-level enhancements that are not tied to one component. */
export function Effects() {
  useEffect(() => {
    initReveal();
    initTitle();
    initSleep();
    const visit = document.querySelector<HTMLElement>('[data-visit]');
    const manifesto = document.querySelector<HTMLElement>('[data-manifesto]');
    const below = document.querySelector<HTMLElement>('[data-below]');
    if (visit && visit.dataset.init === undefined) {
      visit.dataset.init = '';
      initVisits(visit);
    }
    if (manifesto && manifesto.dataset.init === undefined) {
      manifesto.dataset.init = '';
      initManifesto(manifesto);
    }
    if (below && below.dataset.init === undefined) {
      below.dataset.init = '';
      initBelow(below);
    }
  }, []);
  const echo = useInit<HTMLParagraphElement>(initCommands);
  return (
    <>
      <p className="cmd micro" ref={echo} aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
    </>
  );
}
