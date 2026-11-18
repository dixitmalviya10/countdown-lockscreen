import { describe, expect, it } from "vitest";
import { buildGoogleCalendarUrl, generateICS } from "@/lib/ics";
import { DEMO_DEADLINE, DEMO_MILESTONES } from "@/store/useCountdownStore";

describe("ICS & Google Calendar reminders", () => {
  it("generates RFC 5545 compliant ICS with VEVENT, VALARM, and daily RRULE", () => {
    const ics = generateICS(DEMO_DEADLINE, DEMO_MILESTONES, {
      timeOfDay: "09:30",
      dailyRecurring: true,
      browserNotificationEnabled: false,
    });

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("END:VCALENDAR\r\n");

    const eventMatches = ics.match(/BEGIN:VEVENT\r\n/g) ?? [];
    // 7 milestones + 1 daily recurring RRULE event = 8
    expect(eventMatches.length).toBe(DEMO_MILESTONES.length + 1);

    expect(ics).toContain("BEGIN:VALARM\r\n");
    expect(ics).toContain("TRIGGER:-PT15M\r\n");
    expect(ics).toContain("RRULE:FREQ=DAILY;UNTIL=20261123T235959Z\r\n");
    expect(ics).toContain("DTSTART;TZID=America/Los_Angeles:20261116T093000\r\n");
  });

  it("omits daily RRULE event when dailyRecurring is false", () => {
    const ics = generateICS(DEMO_DEADLINE, DEMO_MILESTONES, {
      timeOfDay: "08:00",
      dailyRecurring: false,
      browserNotificationEnabled: false,
    });

    const eventMatches = ics.match(/BEGIN:VEVENT\r\n/g) ?? [];
    expect(eventMatches.length).toBe(DEMO_MILESTONES.length);
    expect(ics).not.toContain("RRULE:FREQ=DAILY");
  });

  it("builds valid Google Calendar template deep links", () => {
    const url = buildGoogleCalendarUrl(
      DEMO_MILESTONES[1],
      DEMO_DEADLINE,
      "09:00"
    );
    expect(url).toContain("https://calendar.google.com/calendar/render?");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("ctz=America%2FLos_Angeles");
    expect(url).toContain("20261116T090000");
  });
});
