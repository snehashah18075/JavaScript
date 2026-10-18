// ============================================================
// clock.js — the single source of "what time is it?"
// Every other module calls now() instead of new Date(), so a demo
// clock can run faster than real time without touching their code.
// Module-level variables below are private to this module.
// ============================================================

let demo = false;
let speed = 1;
let anchorReal = 0;      // real timestamp when demo started
let anchorVirtual = 0;   // simulated timestamp when demo started

export function now() {
  if (!demo) return new Date();
  return new Date(anchorVirtual + (Date.now() - anchorReal) * speed);
}

export function startDemo(startDate, demoSpeed = 60) {
  demo = true;
  speed = demoSpeed;
  anchorReal = Date.now();
  anchorVirtual = startDate.getTime();
}

export function stopDemo() {
  demo = false;
  speed = 1;
}

export const isDemo = () => demo;
export const getSpeed = () => speed;
