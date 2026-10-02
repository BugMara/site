'use client';

import { useEffect } from 'react';
import { site } from '@/config/site';
import { initClocks } from '@/scripts/clock';
import styles from './Clock.module.css';

interface Props {
  className?: string;
}

export function Clock({ className = 'meta' }: Props) {
  const { timeZone, tzLabel, city } = site.location;
  useEffect(() => initClocks(), []);
  return (
    <span
      className={`${styles.clock} ${className}`}
      data-clock
      data-tz={timeZone}
      aria-label={`Local time in ${city}`}
    >
      <span>{tzLabel}</span>
      <span data-clock-time>--:--:--</span>
    </span>
  );
}
