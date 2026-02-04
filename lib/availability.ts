export const availability = {
  timezone: "Europe/Berlin", // Your timezone
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri (0=Sun, 6=Sat)
  hours: {
    start: 9,  // 9 AM
    end: 20,   // 8 PM (20:00)
  },
  slotDuration: 30, // minutes
  blockedDates: ["2026-02-14", "2026-02-15"], // Holidays etc.
};
