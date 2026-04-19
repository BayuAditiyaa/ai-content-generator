import { pickLanguage } from '@/lib/ui-language';

export function translateVideoType(locale, value) {
    const labels = {
        'Marketing Video': 'Video Marketing',
        'Educational Clip': 'Klip Edukasi',
        'Social Media Reel': 'Reel Media Sosial',
        'Product Explainer': 'Video Penjelasan Produk',
        'Testimonial Video': 'Video Testimoni',
        'Brand Story Video': 'Video Cerita Brand',
    };

    return locale === 'id' ? labels[value] ?? value : value;
}

export function translateTone(locale, value) {
    const labels = {
        Professional: 'Profesional',
        Casual: 'Santai',
        Persuasive: 'Persuasif',
        Friendly: 'Ramah',
        Educational: 'Edukatif',
        Confident: 'Percaya Diri',
    };

    return locale === 'id' ? labels[value] ?? value : value;
}

export function formatProvider(value) {
    return String(value ?? 'unknown').toUpperCase();
}

export function formatTemplateKey(value) {
    return String(value ?? 'blank')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function translateVideoFormat(locale, value) {
    const labels = {
        'Talking Head': 'Talking Head',
        Storyboard: 'Storyboard',
        Slideshow: 'Slideshow',
        'UGC Style': 'Gaya UGC',
        'Voiceover Ad': 'Iklan Voiceover',
    };

    return locale === 'id' ? labels[value] ?? value : value;
}

export function formatDurationSeconds(value, locale) {
    const duration = Number(value) || 0;

    if (duration <= 0) {
        return pickLanguage(locale, 'Not specified', 'Belum ditentukan');
    }

    return pickLanguage(locale, `${duration}s`, `${duration} dtk`);
}

export function formatGenerationDuration(value, locale) {
    const duration = Number(value) || 0;

    if (duration <= 0) {
        return pickLanguage(locale, 'Not tracked', 'Tidak terlacak');
    }

    if (duration >= 1000) {
        return pickLanguage(
            locale,
            `${(duration / 1000).toFixed(1)} sec`,
            `${(duration / 1000).toFixed(1)} dtk`,
        );
    }

    return `${duration} ms`;
}

export function getTextStats(value) {
    const text = String(value ?? '').trim();

    if (text === '') {
        return {
            words: 0,
            characters: 0,
        };
    }

    return {
        words: text.split(/\s+/).filter(Boolean).length,
        characters: text.length,
    };
}

export function limitCharacters(value, maxCharacters) {
    return String(value ?? '').slice(0, maxCharacters);
}

export function getSceneCount(variation) {
    return Array.isArray(variation?.scenes) ? variation.scenes.length : 0;
}
