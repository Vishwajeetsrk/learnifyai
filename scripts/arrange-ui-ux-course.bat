@echo off
title Learnify AI - UI & UX Course Builder
color 0B

echo ==============================================================================
echo                Learnify AI: UI & UX Course Builder & Organizer
echo ==============================================================================
echo.
echo Choose an option:
echo.
echo   [1] COMPLETE COURSE BUILD (Recommended)
echo       - Organizes all videos into Module 2 & Module 3 subfolders
echo       - Generates all Markdown readings, labs, and quizzes for Modules 2, 3, 4
echo       - Perfectly matches your existing Module 1 structure
echo.
echo   [2] ARRANGE VIDEOS ONLY (Inside UX Folder)
echo       - Creates Module 1, 2, 3, 4 folders inside the UX raw folder
echo       - Moves and renames the 33 video files with syllabus numbers
echo.
echo ==============================================================================
set /p choice="Enter your choice (1 or 2) [Default is 1]: "

if "%choice%"=="" set choice=1
if "%choice%"=="2" goto Option2
if "%choice%"=="1" goto Option1

:Option1
echo.
echo Running Complete Course Builder...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-complete-ui-ux-course.ps1"
goto Finish

:Option2
echo.
echo Running Video-Only Organizer...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0arrange-ui-ux-course.ps1"
goto Finish

:Finish
echo.
echo ==============================================================================
echo   All tasks completed successfully! Press any key to exit.
echo ==============================================================================
pause >nul
