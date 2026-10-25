import { describe, expect, it } from "vitest";
import { ACTIVITIES, MOODS, pickActivities } from "./activities";
import { defaultSchedule, greeting, lifeStage, parseProfile, workLabel, type Status } from "./profile";

describe("default schedule from status and age", () => {
  it("children at school: 6h school, 10h sleep from 20.30", () => {
    expect(defaultSchedule({ status: "sekolah", age: 10 })).toEqual({ work: 6, sleep: 10, bedtime: 20.5 });
  });
  it("teens at school: 7h school, 9h sleep from 21.30", () => {
    expect(defaultSchedule({ status: "sekolah", age: 16 })).toEqual({ work: 7, sleep: 9, bedtime: 21.5 });
  });
  it("university students: 6h classes, 8h sleep from 23.00", () => {
    expect(defaultSchedule({ status: "sekolah", age: 20 })).toEqual({ work: 6, sleep: 8, bedtime: 23 });
  });
  it("working adults: 8h work, 7.5h sleep from 22.30", () => {
    expect(defaultSchedule({ status: "kerja", age: 30 })).toEqual({ work: 8, sleep: 7.5, bedtime: 22.5 });
  });
  it("working teens get part-time hours", () => {
    expect(defaultSchedule({ status: "kerja", age: 17 }).work).toBe(5);
  });
  it("workers 55+ get 7h work and an earlier bedtime", () => {
    expect(defaultSchedule({ status: "kerja", age: 60 })).toEqual({ work: 7, sleep: 7.5, bedtime: 21.5 });
  });
});

describe("labels and tone", () => {
  it("names the slider by status and age", () => {
    expect(workLabel({ status: "sekolah", age: 15 })).toBe("Jam Sekolah");
    expect(workLabel({ status: "sekolah", age: 19 })).toBe("Jam Kuliah");
    expect(workLabel({ status: "kerja", age: 30 })).toBe("Jam Kerja");
  });
  it("greets by first name and time of day", () => {
    expect(greeting("Zidan Alvino", 19)).toBe("Selamat malam, Zidan.");
    expect(greeting("Dinda", 8)).toBe("Selamat pagi, Dinda.");
  });
  it("age bands", () => {
    expect([12, 13, 18, 26, 55].map(lifeStage)).toEqual(["anak", "remaja", "muda", "dewasa", "matang"]);
  });
});

describe("stored profile", () => {
  it("rejects malformed data", () => {
    expect(parseProfile("{bad")).toBeNull();
    expect(parseProfile(JSON.stringify({ name: "A", status: "libur", age: 20 }))).toBeNull();
    expect(parseProfile(JSON.stringify({ name: "A", status: "kerja", age: 3 }))).toBeNull();
  });
  it("accepts a valid profile", () => {
    expect(parseProfile(JSON.stringify({ name: " Zidan ", status: "kerja", age: 24 }))).toEqual({
      name: "Zidan",
      status: "kerja",
      age: 24,
    });
  });
});

describe("tailored activities", () => {
  it("students never get work-only activities, workers never get school-only ones", () => {
    for (const mood of MOODS) {
      for (let i = 0; i < 30; i++) {
        expect(pickActivities(mood.id, { profile: { status: "sekolah", age: 16 } }).map((a) => a.id)).not.toContain(
          "chair-stretch",
        );
        expect(pickActivities(mood.id, { profile: { status: "kerja", age: 30 } }).map((a) => a.id)).not.toContain(
          "close-books",
        );
      }
    }
  });

  it("children are not offered tea", () => {
    for (let i = 0; i < 30; i++) {
      expect(pickActivities("penat", { profile: { status: "sekolah", age: 9 } }).map((a) => a.id)).not.toContain(
        "mindful-tea",
      );
    }
  });

  it("every mood offers at least 3 activities for every profile", () => {
    const statuses: Status[] = ["sekolah", "kerja"];
    for (const mood of MOODS)
      for (const status of statuses)
        for (const age of [8, 15, 21, 40, 70])
          expect(pickActivities(mood.id, { profile: { status, age } })).toHaveLength(3);
  });

  it("each mood pool has at least 12 activities", () => {
    for (const mood of MOODS) expect(ACTIVITIES[mood.id].length).toBeGreaterThanOrEqual(12);
  });

  it("'Acak Ulang' returns three activities different from the current set", () => {
    const profile = { status: "kerja" as const, age: 30 };
    for (let i = 0; i < 30; i++) {
      const first = pickActivities("rehat", { profile }).map((a) => a.id);
      const next = pickActivities("rehat", { profile, exclude: first }).map((a) => a.id);
      expect(next.some((id) => first.includes(id))).toBe(false);
    }
  });
});
