// ============================================================
// ui.js — everything that touches the DOM.
// Receives plain data from main.js and turns it into HTML.
// ============================================================

import config, { DAYS } from "./data.js";
import { label12, getStatus, classesForDay } from "./scheduler.js";
import { after, formatCountdown, pad } from "./timers.js";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const byId = (id) => document.getElementById(id);
const el = {
  clockTime: byId("clockTime"), clockSuffix: byId("clockSuffix"), clockDate: byId("clockDate"),
  demoBadge: byId("demoBadge"), liveDot: byId("liveDot"),
  heroLabel: byId("heroLabel"), heroTitle: byId("heroTitle"), heroMeta: byId("heroMeta"),
  heroCountLabel: byId("heroCountLabel"), heroCount: byId("heroCount"),
  progressWrap: byId("progressWrap"), progressFill: byId("progressFill"), heroSecondary: byId("heroSecondary"),
  liveBtn: byId("liveBtn"), demoBtn: byId("demoBtn"), remindBtn: byId("remindBtn"),
  listSummary: byId("listSummary"), tabs: byId("tabs"), list: byId("list"), toasts: byId("toasts")
};

const range = (cls) => label12(cls.start) + " \u2013 " + label12(cls.end);

// ---------- Live clock (top right) ----------
export function renderClock(date, demo, speed) {
  const h = date.getHours();
  el.clockTime.textContent = pad(h % 12 || 12) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
  el.clockSuffix.textContent = h >= 12 ? "PM" : "AM";
  el.clockDate.textContent = WEEKDAYS[date.getDay()] + ", " + date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
  el.demoBadge.hidden = !demo;
  el.demoBadge.textContent = "DEMO \u00D7" + speed;
}

// ---------- Hero card: current / next class with countdown ----------
export function renderHero({ date, current, next }) {
  const todayCount = classesForDay(date.getDay()).length;

  if (current) {
    const { cls, start, end } = current;
    el.heroLabel.textContent = "Now in class";
    el.heroTitle.textContent = cls.subject;
    el.heroMeta.textContent = cls.type + " \u00B7 " + cls.room + " \u00B7 " + range(cls);
    el.heroCountLabel.textContent = "Ends in";
    el.heroCount.textContent = formatCountdown(end - date);
    el.progressWrap.hidden = false;
    el.progressFill.style.width = Math.min(100, Math.max(0, ((date - start) / (end - start)) * 100)) + "%";
    el.heroSecondary.textContent = next
      ? "Next: " + next.cls.subject + " at " + label12(next.cls.start) + (next.dayOffset ? " (" + WEEKDAYS[next.day.getDay()] + ")" : "")
      : "That is the last class of the week.";
    return;
  }

  el.progressWrap.hidden = true;
  if (!next) {
    el.heroLabel.textContent = "Timetable";
    el.heroTitle.textContent = "No upcoming classes";
    el.heroMeta.textContent = "Add classes in js/data.js";
    el.heroCountLabel.textContent = "";
    el.heroCount.textContent = "--:--:--";
    el.heroSecondary.textContent = "";
    return;
  }

  const when = next.dayOffset === 0 ? "Next class" : next.dayOffset === 1 ? "Next class \u00B7 Tomorrow" : "Next class \u00B7 " + WEEKDAYS[next.day.getDay()];
  el.heroLabel.textContent = when;
  el.heroTitle.textContent = next.cls.subject;
  el.heroMeta.textContent = next.cls.type + " \u00B7 " + next.cls.room + " \u00B7 " + range(next.cls);
  el.heroCountLabel.textContent = "Starts in";
  el.heroCount.textContent = formatCountdown(next.start - date);
  el.heroSecondary.textContent = todayCount === 0 ? "No classes today." : next.dayOffset === 0 ? "Break time \u2014 get ready." : "That is all for today.";
}

// ---------- Day tabs ----------
export function renderTabs(selectedDay, todayId, onSelect) {
  el.tabs.innerHTML = "";
  DAYS.forEach(d => {
    const b = document.createElement("button");
    b.className = "tab" + (d.id === selectedDay ? " active" : "") + (d.id === todayId ? " today" : "");
    b.textContent = d.short;
    b.title = d.full + (d.id === todayId ? " (today)" : "");
    b.addEventListener("click", () => onSelect(d.id));
    el.tabs.appendChild(b);
  });
}

// ---------- Timetable list (re-drawn only when something changed) ----------
let lastSignature = "";

export function renderList(dayId, date) {
  const isToday = dayId === date.getDay();
  const classes = classesForDay(dayId);
  const statuses = classes.map(c => (isToday ? getStatus(c, date) : "scheduled"));

  if (isToday && classes.length) {
    const done = statuses.filter(s => s === "completed").length;
    el.listSummary.textContent = done + " of " + classes.length + " classes completed";
  } else {
    el.listSummary.textContent = classes.length + " classes";
  }

  const signature = dayId + "|" + statuses.join(",");
  if (signature === lastSignature) return;
  lastSignature = signature;

  el.list.innerHTML = "";
  if (classes.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No classes scheduled.";
    el.list.appendChild(p);
    return;
  }

  classes.forEach((cls, i) => {
    const row = document.createElement("div");
    row.className = "slot " + statuses[i];

    const time = document.createElement("div");
    time.className = "slot-time";
    time.textContent = range(cls);

    const info = document.createElement("div");
    info.className = "slot-info";
    const name = document.createElement("div");
    name.className = "slot-name";
    name.textContent = cls.subject;
    const meta = document.createElement("div");
    meta.className = "slot-meta";
    meta.textContent = cls.type + " \u00B7 " + cls.room;
    info.append(name, meta);

    const chip = document.createElement("span");
    chip.className = "chip " + statuses[i];
    chip.textContent = statuses[i];

    row.append(time, info, chip);
    el.list.appendChild(row);
  });
}

// ---------- Toast notification (auto-dismissed with setTimeout) ----------
export function showToast(message) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  el.toasts.appendChild(t);
  after(() => {
    t.classList.add("leaving");
    after(() => t.remove(), 300);
  }, config.toastDurationMs);
}

// ---------- Button / badge states ----------
export function setLiveState(running) {
  el.liveBtn.textContent = running ? "Pause updates" : "Resume updates";
  el.liveDot.classList.toggle("paused", !running);
  el.liveDot.title = running ? "Updating every second" : "Updates paused";
}

export function setDemoState(demo) {
  el.demoBtn.textContent = demo ? "Stop demo clock" : "Demo clock \u00D7" + config.demoSpeed;
}

export function setReminderState(active) {
  el.remindBtn.textContent = active ? "Reminder set \u2713" : "Remind me";
  el.remindBtn.classList.toggle("on", active);
}

// Let main.js attach click handlers without reaching into the DOM itself
export function onControls({ live, demo, remind }) {
  el.liveBtn.addEventListener("click", live);
  el.demoBtn.addEventListener("click", demo);
  el.remindBtn.addEventListener("click", remind);
}
