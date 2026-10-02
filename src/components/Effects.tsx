'use client';

import { useEffect } from 'react';
import { initReveal } from '@/scripts/reveal';
import { initTitle } from '@/scripts/title';
import { initCommands } from '@/scripts/commands';
import { initSleep } from '@/scripts/sleep';
import { initVisits } from '@/scripts/visits';
import { initManifesto } from '@/scripts/manifesto';
import { initBelow } from '@/scripts/below';
import { initEntropy } from '@/scripts/entropy';
import { initConsole } from '@/scripts/console';
import { initReport } from '@/scripts/report';
import { useInit } from '@/scripts/useInit';

/** Page-level enhancements that are not tied to one component. */
export function Effects() {
  useEffect(() => {
    initReveal();
    initTitle();
    initSleep();
    initConsole();
    const main = document.querySelector<HTMLElement>('main');
    if (main && main.dataset.init === undefined) {
      main.dataset.init = '';
      initEntropy(main);
    }
    const report = document.querySelector<HTMLElement>('[data-report-root]');
    if (report && report.dataset.init === undefined) {
      report.dataset.init = '';
      initReport(report);
    }
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
      <section className="report" data-report-root aria-hidden="true">
        <h2 className="report__title">Incident report</h2>
        <dl className="report__list">
          <dt>Subject</dt>
          <dd>BUGMARA / homepage</dd>
          <dt>Printed</dt>
          <dd data-report="printed" />
          <dt>Visit</dt>
          <dd data-report="visit" />
          <dt>Experiments</dt>
          <dd data-report="exp" />
          <dt>Time on page</dt>
          <dd data-report="time" />
          <dt>Viewport</dt>
          <dd data-report="viewport" />
          <dt>Letters on the floor</dt>
          <dd data-report="fallen" />
          <dt>Letters decayed</dt>
          <dd data-report="decayed" />
          <dt>System</dt>
          <dd data-report="status" />
        </dl>
        <p className="report__note">There is nothing below this.</p>
      </section>
    </>
  );
}
