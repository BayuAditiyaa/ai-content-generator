# ProseAI

**AI Content Generator & Marketing Copywriter**

ProseAI adalah aplikasi web untuk membantu pengguna membuat artikel, copy iklan, caption, deskripsi produk, dan email lebih cepat dengan bantuan AI. Project ini dibangun dengan **Laravel 12**, **Inertia.js**, dan **React 18**, dengan fokus pada UI yang modern, responsif, dan nyaman digunakan.

## Highlights

- Generate konten AI untuk berbagai kebutuhan marketing dan writing
- Multi-variation output untuk membandingkan beberapa hasil sekaligus
- Template konten siap pakai untuk use case umum
- Kontrol target panjang berdasarkan kata atau karakter
- Favorite / best variation selection
- Regenerate brief dengan cepat
- Export hasil ke `.txt`
- Riwayat generasi di halaman terpisah
- Dukungan bilingual UI: **Bahasa Indonesia** dan **English**
- Dukungan provider AI utama + fallback
- Dark mode dan light mode

## Screens & Flow

Alur utama aplikasi:

1. Login atau register
2. Pilih template konten
3. Isi brief
4. Generate beberapa variasi
5. Pilih hasil terbaik
6. Simpan, export, atau regenerate
7. Kelola riwayat di halaman `History`

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** Inertia.js + React 18
- **Styling:** Tailwind CSS
- **Auth:** Laravel Breeze
- **Database:** SQLite untuk local development
- **AI Providers:** Google Gemini sebagai primary, Groq sebagai fallback

## Main Features

### Content Generation

- Content type selection
- Tone selection
- Audience targeting
- Custom instruction
- CTA style
- Output format
- Content goal
- Multi-variation generation

### Productivity Features

- Copy single result
- Copy all variations
- Export `.txt`
- Edit brief from previous result
- Regenerate content
- Best variation marker

### History Management

- Search
- Provider filter
- Favorites filter
- Re-open result
- Delete saved generations

### UX Features

- Responsive layout
- Bilingual interface
- Loading states and skeletons
- Provider indicator
- Generation duration display
- Word / character stats

## SEO Copy

Meta description yang digunakan:

> Hasilkan artikel, copy iklan, dan email dalam hitungan detik dengan ProseAI. AI Content Generator terbaik untuk marketer dan penulis profesional.

Long-tail keywords:

- Cara membuat copywriting iklan otomatis
- Alat pembuat artikel blog cepat dengan Laravel
- Rekomendasi AI untuk menulis email kantor
- How to create ad copywriting automatically
- Fast blog article generator tool built with Laravel
- Best AI recommendation for writing office emails

## AI Disclosure

Project ini adalah **program hasil bantuan AI**.

Penjelasan singkat:

- ide, struktur fitur, dan sebagian implementasi dikembangkan dengan bantuan AI assistant
- project tetap perlu ditinjau, diuji, dan divalidasi secara manual sebelum dipakai di production
- API key, keamanan, dan deployment tetap menjadi tanggung jawab developer

Jika kamu ingin mengunggah project ini ke GitHub atau mempresentasikannya, bagian ini membantu memberi konteks yang jujur bahwa aplikasi dibuat dengan **AI-assisted development workflow**.

## Local Setup

### 1. Clone project

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

### 4. Set database

Project ini menggunakan SQLite untuk local development. Pastikan file database tersedia lalu jalankan migration:

```bash
php artisan migrate
```

### 5. Configure AI provider

Isi `.env` dengan provider utama dan fallback:

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

## Test & Build

Untuk testing dan build:

```bash
php artisan test
npm run build
```

## Production Notes

- Jangan commit API key ke repository publik
- Rotate API key sebelum deploy jika key pernah dipakai selama development
- Gunakan queue / logging / rate limiting jika aplikasi akan dipakai lebih luas
- Review kembali output AI sebelum digunakan untuk kebutuhan bisnis nyata

## Suggested GitHub Topics

Kalau mau, kamu bisa tambahkan topic GitHub seperti:

- `laravel`
- `react`
- `inertiajs`
- `tailwindcss`
- `ai-content-generator`
- `copywriting`
- `marketing-tools`
- `gemini-api`
- `groq`

## License

Project ini bisa kamu sesuaikan lisensinya sesuai kebutuhan. Jika belum ada preferensi, kamu bisa memakai lisensi `MIT`.
