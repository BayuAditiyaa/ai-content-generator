# ProseAI

**AI Video Planning, Script, and Storyboard Generator**

ProseAI is a web application that helps users turn a simple brief into a structured video plan with the help of AI. Instead of rendering full video files, the app focuses on the pre-production workflow: generating video concepts, hooks, summaries, scripts, scene-by-scene storyboards, and CTA ideas in a fast, usable interface.

## What ProseAI Does

- Generate AI-assisted video concepts from a structured brief
- Produce multiple variations from a single prompt
- Build script + storyboard outputs for each variation
- Save, search, revisit, favorite, regenerate, and export results
- Support bilingual UI in English and Bahasa Indonesia
- Use a primary AI provider with fallback support

## Important Scope Note

ProseAI is **not** a full video rendering platform.

It currently generates:
- video ideas
- video summaries
- opening hooks
- narration scripts
- CTA lines
- scene-by-scene storyboard breakdowns

It does **not** currently generate downloadable rendered `.mp4` videos.

This is an intentional product decision to keep the project practical, affordable, and realistic to operate with a low or zero-cost AI workflow.

## Main Flow

1. Register or log in
2. Choose a video template or start from scratch
3. Fill in the brief:
   - video type
   - topic
   - keywords
   - target audience
   - tone
   - goal
   - format
   - CTA style
   - duration
4. Generate 1-3 variations
5. Review the script and storyboard scenes
6. Mark the best variation
7. Export the result as `.txt` or revisit it later in history

## Core Features

### Video Planning

- Video brief form
- Video type selection
- Tone and audience targeting
- Duration presets
- Goal and format controls
- Custom instruction support
- Video-oriented templates

### Output Review

- Multiple AI variations
- Summary, hook, and CTA output
- Script output
- Scene-by-scene storyboard cards
- Best variation selection
- Copy and export actions

### History and Management

- Saved video-plan history
- Search and filter
- Provider filter
- Favorite filter
- Regenerate existing brief
- Reopen and edit previous brief
- Delete saved results

### UX

- Responsive layout
- Dark/light mode
- English/Indonesian toggle
- Loading states and skeletons
- Provider/model indicators

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** Inertia.js + React 18
- **Styling:** Tailwind CSS
- **Auth:** Laravel Breeze
- **Database:** SQLite for local development, MySQL-ready for production
- **AI Providers:** Google Gemini as primary, Groq as fallback

## AI Disclosure

This project was developed using an **AI-assisted workflow**.

That means AI tools were used during ideation, implementation, refinement, and debugging. The final project structure, logic, testing, and deployment preparation were still reviewed and adjusted manually.

## Local Setup

### 1. Clone the project

```bash
git clone https://github.com/your-username/proseai.git
cd proseai
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Set up the database

For local development, SQLite is recommended:

```bash
php artisan migrate
```

### 5. Configure AI providers

```env
AI_CONTENT_PROVIDER=gemini
AI_CONTENT_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
AI_CONTENT_MODEL=gemini-3-flash-preview
AI_CONTENT_API_STYLE=chat_completions
AI_CONTENT_API_KEY=YOUR_GEMINI_API_KEY

AI_CONTENT_FALLBACK_ENABLED=true
AI_CONTENT_FALLBACK_PROVIDER=groq
AI_CONTENT_FALLBACK_BASE_URL=https://api.groq.com/openai/v1
AI_CONTENT_FALLBACK_MODEL=llama-3.1-8b-instant
AI_CONTENT_FALLBACK_API_STYLE=chat_completions
AI_CONTENT_FALLBACK_API_KEY=YOUR_GROQ_API_KEY
```

### 6. Run the app

```bash
composer dev
```

## Test and Build

```bash
php artisan test
npm run build
```

## Production Notes

- Do not commit API keys to a public repository
- Rotate API keys before production if they were exposed during development
- Review AI output before real business use
- If you later want real video rendering, treat it as a separate paid upgrade with a dedicated video API provider

## Suggested GitHub Topics

- `laravel`
- `react`
- `inertiajs`
- `tailwindcss`
- `ai-video-planning`
- `storyboard-generator`
- `video-script-generator`
- `gemini-api`
- `groq`

## License

Use the license that fits your needs. If you do not have a preference yet, `MIT` is a reasonable default.
