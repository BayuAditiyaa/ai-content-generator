# ProseAI: Written Explanation

**Project Title:** ProseAI - AI Video Planning, Script, and Storyboard Generator

**Overview**  
ProseAI is a web application designed to help users plan video content with the help of AI. Instead of rendering full videos, the app focuses on pre-production outputs such as video concepts, hooks, scripts, CTA ideas, and scene-by-scene storyboard breakdowns. The project focuses on a clear workflow, modern user experience, and practical output management so users can generate, compare, save, and reuse video plans efficiently.

**Approach**  
My development approach focused on three priorities: functionality, usability, and deployment readiness. I structured the application around a simple flow where users log in, fill in a video brief, generate multiple AI-powered variations, and manage the results through history, export, and regenerate features. I also separated the generation page and history page to keep the main experience focused and easier to understand.

**Tools and Technologies**  
The application was built using Laravel 12 for backend logic, validation, routing, and database handling. Inertia.js was used to connect Laravel with React 18 so the app could behave like a modern single-page experience without building a separate API frontend. Tailwind CSS was used for the styling system and responsive UI. MySQL was prepared for production deployment, while Google Gemini was used as the primary AI provider and Groq as a fallback provider. The final deployment was prepared on Ubuntu VPS with Nginx.

**Logic and Features**  
The core logic begins when the user fills in a structured video brief, including video type, topic, keywords, target audience, tone, language, duration target, and optional strategic fields such as video goal, CTA style, and format. These inputs are validated in Laravel and transformed into a structured prompt before being sent to the AI provider service.  

The application supports multi-variation output so users can compare multiple generated results from the same brief. Results are stored in the database and can be marked as favorite, copied, exported as `.txt`, regenerated, reopened from history, or deleted. I also added bilingual interface support for English and Indonesian, dark/light theme toggle, loading states, skeleton loading, and provider indicators so the system feels more complete and understandable for end users.

**Key Adjustments During Development**  
Several improvements were made during development to make the application more stable and production-ready. These included fixing the selected result so newly generated video plans appear immediately, improving the Groq fallback response parsing, ensuring `.txt` export downloads correctly, improving responsiveness on mobile views, and adjusting the deployment setup for MySQL, VPS, SSL, and Nginx.

**AI-Assisted Development Note**  
This project was developed using an AI-assisted workflow during ideation, implementation, refinement, and debugging. However, the final structure, testing, fixes, and deployment preparation were manually reviewed and adjusted to ensure the application works properly in a real environment.

**Conclusion**  
ProseAI demonstrates a practical full-stack implementation of an AI-powered video planning platform. The project combines Laravel, React, database persistence, AI provider integration, responsive UI design, bilingual support, and production deployment practices into a usable web application for video ideation and storyboard generation.
