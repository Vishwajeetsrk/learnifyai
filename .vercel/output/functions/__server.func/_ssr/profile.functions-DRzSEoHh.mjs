import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const getPublicProfile_createServerFn_handler = createServerRpc({
  id: "4bf0d871c1b1448bf83ecae994053dfefc9592abecd0f940b98c0f46242944f0",
  name: "getPublicProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getPublicProfile.__executeServer(opts));
const getPublicProfile = createServerFn({
  method: "GET"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getPublicProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const id = data.id;
  const [profileRes, subRes, likesRes, enrollRes, createdRes, certsRes] = await Promise.all([supabaseAdmin.from("profiles").select("id, full_name, avatar_url, bio, created_at").eq("id", id).maybeSingle(), supabaseAdmin.from("creator_subscriptions").select("*", {
    count: "exact",
    head: true
  }).eq("creator_id", id), supabaseAdmin.from("lesson_likes").select("*", {
    count: "exact",
    head: true
  }).eq("user_id", id), supabaseAdmin.from("enrollments").select("course_id, enrolled_at, courses!inner(id, slug, title, cover_url, category)").eq("user_id", id).order("enrolled_at", {
    ascending: false
  }).limit(24), supabaseAdmin.from("courses").select("id, slug, title, cover_url, category").eq("created_by", id).eq("published", true).order("created_at", {
    ascending: false
  }).limit(24), supabaseAdmin.from("certificates").select("*", {
    count: "exact",
    head: true
  }).eq("user_id", id)]);
  if (!profileRes.data) return null;
  return {
    profile: profileRes.data,
    subscribers: subRes.count ?? 0,
    likes: likesRes.count ?? 0,
    certificates: certsRes.count ?? 0,
    enrolled: (enrollRes.data ?? []).map((e) => e.courses).filter(Boolean),
    created: createdRes.data ?? []
  };
});
const getCreatorAnalytics_createServerFn_handler = createServerRpc({
  id: "f8700f9e1b3b1cba227af402b2df3b2e160cb4c5202990d7b89fb6f97b418ac6",
  name: "getCreatorAnalytics",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getCreatorAnalytics.__executeServer(opts));
const getCreatorAnalytics = createServerFn({
  method: "GET"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getCreatorAnalytics_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const id = data.id;
  const {
    data: courses
  } = await supabaseAdmin.from("courses").select("id, slug, title, cover_url").eq("created_by", id);
  const courseIds = (courses ?? []).map((c) => c.id);
  if (courseIds.length === 0) {
    return {
      subscribers: 0,
      totalLikes: 0,
      totalViews: 0,
      totalEnrollments: 0,
      courses: []
    };
  }
  const {
    data: lessons
  } = await supabaseAdmin.from("lessons").select("id, course_id").in("course_id", courseIds);
  const lessonIds = (lessons ?? []).map((l) => l.id);
  const lessonsByCourse = /* @__PURE__ */ new Map();
  for (const l of lessons ?? []) {
    const arr = lessonsByCourse.get(l.course_id) ?? [];
    arr.push(l.id);
    lessonsByCourse.set(l.course_id, arr);
  }
  const [subRes, enrollRes, likesRes, viewsRes] = await Promise.all([supabaseAdmin.from("creator_subscriptions").select("*", {
    count: "exact",
    head: true
  }).eq("creator_id", id), supabaseAdmin.from("enrollments").select("course_id").in("course_id", courseIds), lessonIds.length ? supabaseAdmin.from("lesson_likes").select("lesson_id").in("lesson_id", lessonIds) : Promise.resolve({
    data: []
  }), lessonIds.length ? supabaseAdmin.from("lesson_views").select("lesson_id").in("lesson_id", lessonIds) : Promise.resolve({
    data: []
  })]);
  const enrollByCourse = /* @__PURE__ */ new Map();
  for (const e of enrollRes.data ?? []) enrollByCourse.set(e.course_id, (enrollByCourse.get(e.course_id) ?? 0) + 1);
  const likesByLesson = /* @__PURE__ */ new Map();
  for (const l of likesRes.data ?? []) likesByLesson.set(l.lesson_id, (likesByLesson.get(l.lesson_id) ?? 0) + 1);
  const viewsByLesson = /* @__PURE__ */ new Map();
  for (const v of viewsRes.data ?? []) viewsByLesson.set(v.lesson_id, (viewsByLesson.get(v.lesson_id) ?? 0) + 1);
  const perCourse = (courses ?? []).map((c) => {
    const lids = lessonsByCourse.get(c.id) ?? [];
    const likes = lids.reduce((s, lid) => s + (likesByLesson.get(lid) ?? 0), 0);
    const views = lids.reduce((s, lid) => s + (viewsByLesson.get(lid) ?? 0), 0);
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      cover_url: c.cover_url,
      lessons: lids.length,
      likes,
      views,
      enrollments: enrollByCourse.get(c.id) ?? 0
    };
  });
  return {
    subscribers: subRes.count ?? 0,
    totalLikes: perCourse.reduce((s, c) => s + c.likes, 0),
    totalViews: perCourse.reduce((s, c) => s + c.views, 0),
    totalEnrollments: perCourse.reduce((s, c) => s + c.enrollments, 0),
    courses: perCourse.sort((a, b) => b.views - a.views)
  };
});
export {
  getCreatorAnalytics_createServerFn_handler,
  getPublicProfile_createServerFn_handler
};
