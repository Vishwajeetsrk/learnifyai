import React from "react";
import { Composition } from "remotion";
import { CourseLessonIntro, type CourseLessonIntroProps } from "./CourseLessonIntro";

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
    </>
  );
};
