# Dead Code Report

Detected 69 unused exports via AST parsing.

- **Unused Functions**: `isPlayableLessonVideo`, `extractYouTubeVideoId`, `xpToNextLevel`
- **Unused UI Components**: `AlertDialogPortal`, `CalendarDayButton`, `CardHeader`, `DropdownMenuSubContent`
- **Unused Types**: `BadgeProps`, `ButtonProps`, `FeatureFlag`

_Recommendation: Prune exported functions that are only used internally by removing the `export` keyword._
