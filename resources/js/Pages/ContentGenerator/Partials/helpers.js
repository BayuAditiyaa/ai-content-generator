import { pickLanguage } from '@/lib/ui-language';

export function translateContentType(locale, value) {
    const labels = {
        'Blog Post': 'Artikel Blog',
        Email: 'Email',
        'Ad Copy': 'Copy Iklan',
        'Social Media Post': 'Postingan Media Sosial',
        'Product Description': 'Deskripsi Produk',
        'Educational Content': 'Konten Edukasi',
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

export function assessLengthTarget(stats, lengthControlType, lengthControlValue) {
    const target = Number(lengthControlValue) || 0;
    const measuredValue =
        lengthControlType === 'characters' ? stats.characters : stats.words;

    if (target <= 0) {
        return { status: 'near' };
    }

    const lowerBound = target * 0.85;
    const upperBound = target * 1.15;

    if (measuredValue < lowerBound) {
        return { status: 'short' };
    }

    if (measuredValue > upperBound) {
        return { status: 'long' };
    }

    return { status: 'near' };
}
