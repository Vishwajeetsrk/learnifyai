import React from "react";
import { Composition } from "remotion";
import { CourseLessonIntro, type CourseLessonIntroProps } from "./CourseLessonIntro";
import { CourseLessonExplainer, type CourseLessonExplainerProps } from "./CourseLessonExplainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<any, CourseLessonIntroProps>
        id="CourseLessonIntro"
        component={CourseLessonIntro}
        durationInFrames={150} // 5s at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          courseTitle: "Designing User Interfaces and Experiences (UI & UX)",
          lessonTitle: "1. Course Introduction",
          category: "UI/UX Design",
          level: "Beginner",
          durationMinutes: 5,
          tags: ["Figma", "DesignThinking", "Wireframing"],
          instructorName: "Learnify AI Curriculum",
        } satisfies CourseLessonIntroProps}
      />

      <Composition<any, CourseLessonExplainerProps>
        id="CourseLessonExplainer"
        component={CourseLessonExplainer}
        durationInFrames={600} // 20s at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          courseTitle: "Designing User Interfaces and Experiences (UI & UX)",
          lessonTitle: "Mastering Intuitive UI & Design Systems",
          category: "UI/UX Design",
          level: "Beginner to Pro",
          durationMinutes: 15,
          audioFileName: "videos/lesson-narration.mp3",
          instructorName: "Learnify AI Curriculum Team",
        } satisfies CourseLessonExplainerProps}
      />
    </>
  );
};
