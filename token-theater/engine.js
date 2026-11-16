// Deliberately model-independent units, not a production model tokenizer.
export function tokenize(text) {
  return text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]|[A-Za-z0-9_]{1,4}|\s+|[^\s]/gu) || [];
}
export function stateAt(elapsed, speed, count, { latency, wait, cadence }) {
  const start = latency + wait;
  if (elapsed < start) return { phase: elapsed < latency ? 'connecting' : 'thinking', count: 0, first: null, done: false };
  let active = elapsed - start;
  // 1.2 seconds of network pause after every 2.8 seconds of generation.
  if (cadence === 'jitter') active = Math.floor(active / 4) * 2.8 + Math.min(active % 4, 2.8);
  let produced = Math.floor(active * speed + 1e-9);
  if (cadence === 'chunk') produced = Math.floor(produced / 8) * 8;
  const visible = Math.min(count, produced);
  const first = start + (cadence === 'chunk' ? 8 : 1) / speed;
  let duration = (cadence === 'chunk' ? Math.ceil(count / 8) * 8 : count) / speed;
  if (cadence === 'jitter') duration += Math.max(0, Math.ceil(duration / 2.8) - 1) * 1.2;
  return { phase: visible >= count ? 'done' : cadence === 'jitter' && (elapsed-start)%4 >= 2.8 ? 'stalled' : 'output', count: visible, first: visible ? first : null, done: visible >= count, duration, end: start + duration };
}
