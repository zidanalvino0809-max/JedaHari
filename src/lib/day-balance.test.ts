import { describe, expect, it } from "vitest";
import { computeDay, formatClock, formatDuration } from "./day-balance";

describe("computeDay", () => {
  it("free time is 24 minus work and sleep hours", () => {
    expect(computeDay({ workHours: 8, sleepHours: 8, bedtime: 22 }).free).toBe(8);
  });

  it("never lets free time go negative when work + sleep exceed 24", () => {
    const day = computeDay({ workHours: 14, sleepHours: 12, bedtime: 22 });
    expect(day.free).toBe(0);
    expect(day.work).toBe(12);
  });

  it("wakes after sleeping from bedtime and starts work one hour later", () => {
    const day = computeDay({ workHours: 8, sleepHours: 8, bedtime: 22 });
    expect(day.wake).toBe(6);
    expect(day.workStart).toBe(7);
    expect(day.workEnd).toBe(15);
  });
});

describe("formatting", () => {
  it("formats durations in Indonesian", () => {
    expect(formatDuration(7.5)).toBe("7 jam 30 mnt");
    expect(formatDuration(8)).toBe("8 jam");
  });

  it("formats clock times with a dot separator", () => {
    expect(formatClock(22.5)).toBe("22.30");
    expect(formatClock(25)).toBe("01.00");
  });
});
