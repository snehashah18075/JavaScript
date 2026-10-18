// ============================================================
// timers.js — small wrappers around setInterval / setTimeout
// ============================================================

export const pad = (n) => String(n).padStart(2, "0");

// Repeating ticker built on setInterval(); can be paused and resumed with clearInterval().
export function createTicker(callback, intervalMs = 1000) {
  let id = null;
  return {
    start() {
      if (id !== null) return;
      callback();                              // run once immediately, then every interval
      id = setInterval(callback, intervalMs);
    },
    stop() {
      if (id === null) return;
      clearInterval(id);
      id = null;
    },
    get running() { return id !== null; }
  };
}

// One-off delayed action built on setTimeout(); returns a function that cancels it.
export function after(fn, ms) {
  const id = setTimeout(fn, ms);
  return () => clearTimeout(id);
}

// milliseconds -> "HH:MM:SS" (or "Xd HH:MM:SS" when a day or more remains)
export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return (d > 0 ? d + "d " : "") + pad(h) + ":" + pad(m) + ":" + pad(s);
}
