import { describe, expect, it } from "vitest";
import {
  buildCourseVideoEmbedUrl,
  choosePlayableResumeLessonId,
  chooseResumeLessonId,
  getCourseActionLabel,
  hasCourseToolAccess,
} from "../course-player";

describe("course player entitlements", () => {
  it("hides AI and playground tools without access or progress", () => {
    expect(
      hasCourseToolAccess({ isEnrolled: false, progressPct: 0, hasSavedProgress: false }),
    ).toBe(false);
  });

  it("shows AI and playground tools for enrolled, started, completed, or admin users", () => {
    expect(hasCourseToolAccess({ isEnrolled: true })).toBe(true);
    expect(hasCourseToolAccess({ progressPct: 1 })).toBe(true);
    expect(hasCourseToolAccess({ hasSavedProgress: true })).toBe(true);
    expect(hasCourseToolAccess({ enrollmentStatus: "completed" })).toBe(true);
    expect(hasCourseToolAccess({ isAdmin: true })).toBe(true);
  });
});

describe("course action labels", () => {
  it("shows Start for 0% courses and Resume after progress", () => {
    expect(getCourseActionLabel(0, "active")).toBe("Start");
    expect(getCourseActionLabel(35, "active")).toBe("Resume");
    expect(getCourseActionLabel(100, "completed")).toBe("Review");
  });
});

describe("resume lesson selection", () => {
  it("restores the latest saved lesson for a course", () => {
    expect(
      chooseResumeLessonId(
        [{ id: "lesson-1" }, { id: "lesson-2" }],
        [
          { lesson_id: "lesson-1", updated_at: "2026-06-01T10:00:00Z" },
          { lesson_id: "lesson-2", updated_at: "2026-06-02T10:00:00Z" },
        ],
        new Set(["lesson-1", "lesson-2"]),
      ),
    ).toBe("lesson-2");
  });

  it("skips lessons without playable video URLs when choosing a start lesson", () => {
    expect(
      choosePlayableResumeLessonId(
        [
          { id: "lesson-1", video_url: null },
          { id: "lesson-2", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        ],
        [],
        new Set(["lesson-1", "lesson-2"]),
      ),
    ).toBe("lesson-2");
  });
});

describe("course video embeds", () => {
  it("normalizes YouTube links to autoplay-ready embeds", () => {
    const result = buildCourseVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", 12);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.src).toContain("/embed/dQw4w9WgXcQ");
      expect(result.src).toContain("autoplay=1");
      expect(result.src).toContain("mute=1");
      expect(result.src).toContain("start=12");
    }
  });

  it("returns a clear invalid-url result for broken YouTube URLs", () => {
    const result = buildCourseVideoEmbedUrl("https://www.youtube.com/watch?v=bad");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/invalid/i);
  });
});
