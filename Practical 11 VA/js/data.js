// ============================================================
// data.js — timetable data + app settings
// Demonstrates NAMED exports (DAYS, SCHEDULE) and a DEFAULT export (config).
// Edit the timetable below freely: days are 1 = Monday ... 5 = Friday,
// times are 24-hour "HH:MM".
// ============================================================

export const DAYS = [
  { id: 1, short: "Mon", full: "Monday" },
  { id: 2, short: "Tue", full: "Tuesday" },
  { id: 3, short: "Wed", full: "Wednesday" },
  { id: 4, short: "Thu", full: "Thursday" },
  { id: 5, short: "Fri", full: "Friday" }
];

export const SCHEDULE = {
  1: [
    { id: "mon-1", subject: "Data Mining",                       type: "Lecture", room: "Room 301", start: "09:00", end: "10:00" },
    { id: "mon-2", subject: "DBMS",                              type: "Lecture", room: "Room 301", start: "10:00", end: "11:00" },
    { id: "mon-3", subject: "Economics",                         type: "Lecture", room: "Room 204", start: "11:15", end: "12:15" },
    { id: "mon-4", subject: "JavaScript Lab",                    type: "Lab",     room: "Lab 2",    start: "13:00", end: "15:00" },
    { id: "mon-5", subject: "Operating Systems",                 type: "Lecture", room: "Room 301", start: "15:15", end: "16:15" }
  ],
  2: [
    { id: "tue-1", subject: "Data Analytics",                    type: "Lecture", room: "Room 204", start: "09:00", end: "10:00" },
    { id: "tue-2", subject: "Computer Networks",                 type: "Lecture", room: "Room 301", start: "10:00", end: "11:00" },
    { id: "tue-3", subject: "Business for Data Driven Companies", type: "Lecture", room: "Room 105", start: "11:15", end: "12:15" },
    { id: "tue-4", subject: "DBMS Lab",                          type: "Lab",     room: "Lab 3",    start: "13:00", end: "15:00" }
  ],
  3: [
    { id: "wed-1", subject: "Operating Systems",                 type: "Lecture", room: "Room 301", start: "09:00", end: "10:00" },
    { id: "wed-2", subject: "Data Mining",                       type: "Lecture", room: "Room 301", start: "10:00", end: "11:00" },
    { id: "wed-3", subject: "Economics",                         type: "Lecture", room: "Room 204", start: "11:15", end: "12:15" },
    { id: "wed-4", subject: "Data Analytics",                    type: "Lecture", room: "Room 204", start: "13:00", end: "14:00" },
    { id: "wed-5", subject: "Computer Networks",                 type: "Lecture", room: "Room 301", start: "14:15", end: "15:15" }
  ],
  4: [
    { id: "thu-1", subject: "DBMS",                              type: "Lecture", room: "Room 301", start: "09:00", end: "10:00" },
    { id: "thu-2", subject: "JavaScript Lab",                    type: "Lab",     room: "Lab 2",    start: "10:15", end: "12:15" },
    { id: "thu-3", subject: "Business for Data Driven Companies", type: "Lecture", room: "Room 105", start: "13:00", end: "14:00" },
    { id: "thu-4", subject: "Data Mining",                       type: "Lecture", room: "Room 301", start: "14:15", end: "15:15" }
  ],
  5: [
    { id: "fri-1", subject: "Computer Networks",                 type: "Lecture", room: "Room 301", start: "09:00", end: "10:00" },
    { id: "fri-2", subject: "Operating Systems",                 type: "Lecture", room: "Room 301", start: "10:00", end: "11:00" },
    { id: "fri-3", subject: "Data Analytics",                    type: "Lecture", room: "Room 204", start: "11:15", end: "12:15" },
    { id: "fri-4", subject: "Economics",                         type: "Lecture", room: "Room 204", start: "13:00", end: "14:00" }
  ]
};

// Default export: app-wide settings
export default {
  reminderLeadMinutes: 5,   // "Remind me" fires this many minutes before the next class
  toastDurationMs: 4000,    // how long a notification stays on screen
  demoSpeed: 60,            // demo clock: 1 real second = 60 simulated seconds
  demoStart: "08:50"        // demo clock starts at this time on a weekday
};
