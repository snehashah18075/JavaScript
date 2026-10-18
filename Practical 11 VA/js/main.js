// ============================================================
// main.js — entry point. Imports every module and wires them together.
//   setInterval  -> 1-second ticker that refreshes clock, countdown and statuses
//   clearInterval-> "Pause updates" button
//   setTimeout   -> "Remind me" reminder, and auto-dismissing toasts (in ui.js)
// ============================================================

import config from "./data.js";
import { now, startDemo, stopDemo, isDemo, getSpeed } from "./clock.js";
import { getCurrent, getNext, demoStart, label12 } from "./scheduler.js";
import { createTicker, after, formatCountdown, pad } from "./timers.js";
import { renderClock, renderHero, renderTabs, renderList, showToast, setLiveState, setDemoState, setReminderState, onControls } from "./ui.js";

const defaultDay = (d) => (d.getDay() >= 1 && d.getDay() <= 5 ? d.getDay() : 1);

let selectedDay = defaultDay(now());
let lastToday = null;
let lastCurrentId;            // undefined until the first tick
let cancelReminder = null;

// ---------- One tick: runs every second ----------
function tick() {
  const date = now();

  if (date.getDay() !== lastToday) {
    lastToday = date.getDay();
    renderTabs(selectedDay, lastToday, selectDay);
  }

  const current = getCurrent(date);
  const next = getNext(date);

  renderClock(date, isDemo(), getSpeed());
  renderHero({ date, current, next });
  renderList(selectedDay, date);

  // Announce when a new class begins
  const currentId = current ? current.cls.id : null;
  if (lastCurrentId !== undefined && currentId && currentId !== lastCurrentId) {
    showToast("Class started: " + current.cls.subject);
  }
  lastCurrentId = currentId;
}

function selectDay(id) {
  selectedDay = id;
  renderTabs(selectedDay, now().getDay(), selectDay);
  renderList(selectedDay, now());
}

const ticker = createTicker(tick, 1000);

// ---------- Controls ----------
function toggleLive() {
  ticker.running ? ticker.stop() : ticker.start();
  setLiveState(ticker.running);
}

function toggleDemo() {
  if (!isDemo()) {
    startDemo(demoStart(new Date(), config.demoStart), config.demoSpeed);
    showToast("Demo clock started \u2014 1 second = " + config.demoSpeed + " seconds");
  } else {
    stopDemo();
    showToast("Back to real time");
  }
  if (cancelReminder) { cancelReminder(); cancelReminder = null; setReminderState(false); }
  selectedDay = defaultDay(now());
  lastToday = null;
  lastCurrentId = undefined;
  setDemoState(isDemo());
  tick();
}

function toggleReminder() {
  if (cancelReminder) {
    cancelReminder();
    cancelReminder = null;
    setReminderState(false);
    showToast("Reminder cancelled");
    return;
  }

  const date = now();
  const next = getNext(date);
  if (!next) return showToast("No upcoming class to remind you about.");

  const lead = config.reminderLeadMinutes * 60000;
  const simulatedDelay = next.start - date - lead;        // ms of (possibly simulated) time to wait

  if (simulatedDelay <= 0) {
    return showToast(next.cls.subject + " starts in " + formatCountdown(next.start - date));
  }

  const at = new Date(next.start.getTime() - lead);
  const realDelay = simulatedDelay / getSpeed();          // convert to real milliseconds for setTimeout
  cancelReminder = after(() => {
    showToast("\u23F0 " + next.cls.subject + " starts in " + config.reminderLeadMinutes + " minutes");
    cancelReminder = null;
    setReminderState(false);
  }, realDelay);

  setReminderState(true);
  showToast("Reminder set for " + label12(pad(at.getHours()) + ":" + pad(at.getMinutes())));
}

onControls({ live: toggleLive, demo: toggleDemo, remind: toggleReminder });

// ---------- Start ----------
setDemoState(false);
setReminderState(false);
ticker.start();
setLiveState(true);
