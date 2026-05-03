# ProseAI: Written Explanation

**Project Title:** ProseAI - AI Video Planning, Script, and Storyboard Generator

## Overview
ProseAI is a web application designed to help users plan video content with AI. Instead of rendering full video files, the app focuses on pre-production outputs such as video concepts, summaries, hooks, scripts, CTA ideas, and scene-by-scene storyboard breakdowns. The goal of the project is to provide a practical, modern, and easy-to-use workflow for turning a brief into a structured video plan.

## Approach
My development approach focused on three priorities: functionality, usability, and deployment readiness. I structured the app around a simple flow where users log in, fill in a video brief, generate multiple AI-powered variations, review the results, and manage them through history, regenerate, favorite, and export features. I also separated the generator page and the history page so the main experience stays focused and easier to understand.

## Tools and Technologies
The application was built using Laravel 12 for backend logic, routing, validation, and database handling. Inertia.js and React 18 were used to create a modern single-page user experience without building a separate API frontend. Tailwind CSS was used for styling and responsiveness. For AI integration, Google Gemini is used as the primary provider and Groq is configured as a fallback provider. The project is prepared for deployment with MySQL, Ubuntu VPS, and Nginx.

## Logic and Features
The core logic begins when the user fills in a structured video brief, including video type, topic, keywords, target audience, tone, duration, goal, format, CTA style, and optional custom instruction. These inputs are validated in Laravel and transformed into a structured AI prompt. The system then generates multiple video-plan variations that may include a summary, hook, narration script, CTA, and scene-by-scene storyboard output. Results are stored in the database and can be reopened, filtered, regenerated, marked as favorite, or exported as `.txt`.

## Final Notes
The application supports bilingual UI in English and Bahasa Indonesia, dark/light mode, responsive layouts, loading states, and provider indicators. This project was developed using an AI-assisted workflow during planning, implementation, refinement, and debugging, while the final structure, testing, and deployment preparation were reviewed manually. ProseAI is intentionally positioned as an AI video planning and storyboard generator rather than a full video rendering platform, making it practical to operate with a zero-cost or low-cost workflow.
