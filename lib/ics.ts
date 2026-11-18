import { addHours, format, parseISO } from "date-fns";
import type { Deadline, Milestone, ReminderConfig } from "@/types";
import { formatOffsetLabel } from "./planner";

function escapeICSText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toICSDateTime(dateStr: string, timeOfDay: string): string {
  const cleanDate = dateStr.slice(0, 10).replace(/-/g, "");
  const [hhRaw, mmRaw] = timeOfDay.split(":");
  const hh = (hhRaw ?? "09").padStart(2, "0");
  const mm = (mmRaw ?? "00").padStart(2, "0");
  return `${cleanDate}T${hh}${mm}00`;
}

function toICSEndDateTime(dateStr: string, timeOfDay: string): string {
  const [hhRaw, mmRaw] = timeOfDay.split(":");
  const hh = Number.parseInt(hhRaw ?? "9", 10);
  const mm = Number.parseInt(mmRaw ?? "0", 10);
  const base = parseISO(`${dateStr.slice(0, 10)}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  const end = addHours(Number.isNaN(base.getTime()) ? new Date() : base, 1);
  return format(end, "yyyyMMdd'T'HHmmss");
}

/**
 * Generates an RFC 5545 valid .ics calendar file with CRLF line endings.
 * Includes one VEVENT per milestone with a 15-minute VALARM,
 * plus an optional daily recurring check-in VEVENT until the deadline.
 */
export function generateICS(
  deadline: Deadline,
  milestones: Milestone[],
  config: ReminderConfig
): string {
  const nowStamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//T-Minus Studio//Countdown Lock Screen Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICSText(`T-Minus: ${deadline.title}`)}`,
  ];

  for (const m of milestones) {
    const dtStart = toICSDateTime(m.computedDateISO, config.timeOfDay);
    const dtEnd = toICSEndDateTime(m.computedDateISO, config.timeOfDay);
    const summary = `${formatOffsetLabel(m.offsetDays)}: ${m.action} (${deadline.title})`;
    const description = `T-Minus Milestone for "${deadline.title}" (${deadline.category}).\\nTarget Deadline: ${deadline.targetDateISO} (${deadline.timezone})`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${m.id}-${deadline.id}@tminus.studio`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;TZID=${deadline.timezone}:${dtStart}`,
      `DTEND;TZID=${deadline.timezone}:${dtEnd}`,
      `SUMMARY:${escapeICSText(summary)}`,
      `DESCRIPTION:${description}`,
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICSText(summary)}`,
      "TRIGGER:-PT15M",
      "END:VALARM",
      "END:VEVENT"
    );
  }

  if (config.dailyRecurring) {
    const sorted = [...milestones].sort(
      (a, b) => b.offsetDays - a.offsetDays
    );
    const startDate =
      sorted[0]?.computedDateISO ?? format(new Date(), "yyyy-MM-dd");
    const endDateClean = deadline.targetDateISO
      .slice(0, 10)
      .replace(/-/g, "");
    const dtStart = toICSDateTime(startDate, config.timeOfDay);
    const dtEnd = toICSEndDateTime(startDate, config.timeOfDay);

    lines.push(
      "BEGIN:VEVENT",
      `UID:daily-${deadline.id}@tminus.studio`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;TZID=${deadline.timezone}:${dtStart}`,
      `DTEND;TZID=${deadline.timezone}:${dtEnd}`,
      `RRULE:FREQ=DAILY;UNTIL=${endDateClean}T235959Z`,
      `SUMMARY:${escapeICSText(`Daily Check-in: ${deadline.title}`)}`,
      `DESCRIPTION:${escapeICSText(`Review today's T-minus milestone on your lock screen for ${deadline.title}.`)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICSText(`Daily T-Minus Check-in: ${deadline.title}`)}`,
      "TRIGGER:-PT10M",
      "END:VALARM",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  return `${lines.join("\r\n")}\r\n`;
}

export function buildGoogleCalendarUrl(
  milestone: Milestone,
  deadline: Deadline,
  timeOfDay: string
): string {
  const dtStart = toICSDateTime(milestone.computedDateISO, timeOfDay);
  const dtEnd = toICSEndDateTime(milestone.computedDateISO, timeOfDay);
  const title = `${formatOffsetLabel(milestone.offsetDays)}: ${milestone.action} — ${deadline.title}`;
  const details = `T-Minus Studio milestone for ${deadline.title} (${deadline.category}). Target: ${deadline.targetDateISO} (${deadline.timezone}).`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${dtStart}/${dtEnd}`,
    details,
    ctz: deadline.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICSFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
