// ============================================================
// scheduler.js — pure scheduling logic (no DOM, no timers).
// Imports the timetable from data.js and answers questions such as
// "which class is on now?" and "what is the next class?".
// ============================================================

import { SCHEDULE } from "./data.js";

// Combine a calendar day with an "HH:MM" string -> Date
export function toDate(day, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d;
}

// "13:05" -> "1:05 PM"
export function label12(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 12 || 12) + ":" + String(m).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM");
}

export function classesForDay(dayId) {
  return SCHEDULE[dayId] || [];
}

export function getStatus(cls, date) {
  if (date >= toDate(date, cls.end)) return "completed";
  if (date >= toDate(date, cls.start)) return "ongoing";
  return "upcoming";
}

// The class running right now, or null
export function getCurrent(date) {
  const cls = classesForDay(date.getDay()).find(c => getStatus(c, date) === "ongoing");
  return cls ? { cls, start: toDate(date, cls.start), end: toDate(date, cls.end) } : null;
}

// The next class that has not started yet (searches up to a week ahead), or null
export function getNext(date) {
  for (let offset = 0; offset <= 7; offset++) {
    const day = new Date(date);
    day.setDate(date.getDate() + offset);
    for (const cls of classesForDay(day.getDay())) {
      const start = toDate(day, cls.start);
      if (start > date) return { cls, start, end: toDate(day, cls.end), dayOffset: offset, day };
    }
  }
  return null;
}

// Where the demo clock should begin: the next weekday (today if it is one) at hhmm
export function demoStart(realNow, hhmm) {
  const d = new Date(realNow);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return toDate(d, hhmm);
}
