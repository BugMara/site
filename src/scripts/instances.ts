import { emit, on } from './bus';
import { createLoop, lerp, pad } from './motion';

/**
 * One organism across tabs. Every open tab of the site announces itself on a
 * BroadcastChannel. The hero reports how many there are; the other tabs' pointers show up
 * as grey dots in yours; a letter broken in one tab falls in all of them.
 */
const CHANNEL = 'bugmara';
const HEARTBEAT = 1500;
const STALE = 4000;
const POINTER_EVERY = 40;

type Msg =
  | { t: 'hello' | 'ping' | 'bye'; id: string }
  | { t: 'pointer'; id: string; x: number; y: number }
  | { t: 'fell'; id: string; index: number }
  | { t: 'rebuild'; id: string };

interface Peer {
  seen: number;
  dot: HTMLElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

export function initInstances(counter: HTMLElement): void {
  if (typeof BroadcastChannel === 'undefined') return;

  const id = Math.random().toString(36).slice(2, 8);
  const ch = new BroadcastChannel(CHANNEL);
  const peers = new Map<string, Peer>();
  const layer = document.createElement('div');
  layer.className = 'peers';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const post = (m: Msg) => ch.postMessage(m);

  const render = () => {
    const n = peers.size + 1;
    counter.textContent = `Instances ${pad(n)}`;
    counter.hidden = n < 2;
    document.documentElement.toggleAttribute('data-multi', n > 1);
  };

  const loop = createLoop(() => {
    let busy = false;
    for (const p of peers.values()) {
      p.x = lerp(p.x, p.tx, 0.2);
      p.y = lerp(p.y, p.ty, 0.2);
      p.dot.style.translate = `${(p.x * window.innerWidth).toFixed(1)}px ${(p.y * window.innerHeight).toFixed(1)}px`;
      if (Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 0.0005) busy = true;
    }
    return busy;
  });

  const touch = (pid: string) => {
    let p = peers.get(pid);
    if (!p) {
      const dot = document.createElement('i');
      dot.className = 'peers__dot';
      dot.dataset.label = pad(peers.size + 2);
      layer.appendChild(dot);
      p = { seen: 0, dot, x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
      peers.set(pid, p);
      render();
    }
    p.seen = Date.now();
    return p;
  };

  const forget = (pid: string) => {
    const p = peers.get(pid);
    if (!p) return;
    p.dot.remove();
    peers.delete(pid);
    render();
  };

  ch.onmessage = (e: MessageEvent<Msg>) => {
    const m = e.data;
    if (!m || m.id === id) return;
    switch (m.t) {
      case 'hello':
        touch(m.id);
        post({ t: 'ping', id });
        break;
      case 'ping':
        touch(m.id);
        break;
      case 'bye':
        forget(m.id);
        break;
      case 'pointer': {
        const p = touch(m.id);
        p.tx = m.x;
        p.ty = m.y;
        p.dot.classList.add('is-on');
        loop.wake();
        break;
      }
      case 'fell':
        touch(m.id);
        emit('drop', { index: m.index, remote: true });
        break;
      case 'rebuild':
        touch(m.id);
        emit('rebuild', { remote: true });
        break;
    }
  };

  // ---- outbound ------------------------------------------------------------
  let lastPointer = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      const now = performance.now();
      if (now - lastPointer < POINTER_EVERY) return;
      lastPointer = now;
      post({
        t: 'pointer',
        id,
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    },
    { passive: true },
  );
  on('fell', (d) => {
    const index = (d as { index?: number } | undefined)?.index;
    if (typeof index === 'number') post({ t: 'fell', id, index });
  });
  on('rebuilt', (d) => {
    if (!(d as { remote?: boolean } | undefined)?.remote) post({ t: 'rebuild', id });
  });
  window.addEventListener('pagehide', () => post({ t: 'bye', id }));

  window.setInterval(() => {
    post({ t: 'ping', id });
    const now = Date.now();
    for (const [pid, p] of peers) if (now - p.seen > STALE) forget(pid);
  }, HEARTBEAT);

  post({ t: 'hello', id });
  render();
}
