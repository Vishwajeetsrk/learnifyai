function hasCourseToolAccess(input) {
  return Boolean(
    input.isAdmin || input.isEnrolled || input.enrollmentStatus === "completed" || (input.progressPct ?? 0) > 0 || input.hasSavedProgress || input.hasCertificate
  );
}
function getCourseActionLabel(progressPct, status) {
  if (status === "completed") return "Review";
  return (progressPct ?? 0) > 0 ? "Resume" : "Start";
}
function chooseResumeLessonId(lessons, progressRows, unlockedLessonIds) {
  const latest = [...progressRows].filter((p) => unlockedLessonIds.has(p.lesson_id)).sort(
    (a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime()
  )[0];
  return lessons.find((lesson) => lesson.id === latest?.lesson_id)?.id ?? lessons.find(
    (lesson) => unlockedLessonIds.has(lesson.id) && !progressRows.some((p) => p.lesson_id === lesson.id && p.completed)
  )?.id ?? lessons[0]?.id ?? null;
}
function isPlayableLessonVideo(videoUrl) {
  return buildCourseVideoEmbedUrl(videoUrl).ok;
}
function choosePlayableResumeLessonId(lessons, progressRows, unlockedLessonIds) {
  const playable = lessons.filter(
    (lesson) => unlockedLessonIds.has(lesson.id) && isPlayableLessonVideo(lesson.video_url)
  );
  if (!playable.length) return null;
  const playableIds = new Set(playable.map((lesson) => lesson.id));
  return chooseResumeLessonId(playable, progressRows, playableIds) ?? playable[0]?.id ?? null;
}
function extractYouTubeVideoId(input) {
  const value = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).slice(0, 11);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com")) {
      const watchId = url.searchParams.get("v");
      if (watchId) {
        const id = watchId.slice(0, 11);
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      const match = url.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }
  } catch {
    return null;
  }
  return null;
}
function buildCourseVideoEmbedUrl(input, startSeconds = 0, origin) {
  const raw = input?.trim();
  if (!raw) {
    return {
      ok: false,
      reason: "missing-url",
      message: "This lesson does not have a video attached yet."
    };
  }
  const videoId = extractYouTubeVideoId(raw);
  if (videoId) {
    const url = new URL(`https://www.youtube.com/embed/${videoId}`);
    url.searchParams.set("enablejsapi", "1");
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("mute", "1");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("rel", "0");
    url.searchParams.set("modestbranding", "1");
    if (origin) url.searchParams.set("origin", origin);
    if (startSeconds > 5) url.searchParams.set("start", String(Math.floor(startSeconds)));
    return { ok: true, src: url.toString(), isYoutube: true };
  }
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes("youtube") || host === "youtu.be") {
      return {
        ok: false,
        reason: "invalid-url",
        message: "This YouTube URL is invalid or missing a video ID."
      };
    }
    return { ok: true, src: url.toString(), isYoutube: false };
  } catch {
    return {
      ok: false,
      reason: "invalid-url",
      message: "This lesson video URL is invalid. Ask an admin or creator to replace it with a valid YouTube link."
    };
  }
}
export {
  chooseResumeLessonId as a,
  buildCourseVideoEmbedUrl as b,
  choosePlayableResumeLessonId as c,
  getCourseActionLabel as g,
  hasCourseToolAccess as h
};
