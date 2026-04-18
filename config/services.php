<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'ai_content' => [
        'provider' => env('AI_CONTENT_PROVIDER', 'openai'),
        'base_url' => env('AI_CONTENT_BASE_URL', 'https://api.openai.com/v1'),
        'api_key' => env('AI_CONTENT_API_KEY'),
        'model' => env('AI_CONTENT_MODEL', 'gpt-4.1-mini'),
        'api_style' => env('AI_CONTENT_API_STYLE', 'chat_completions'),
    ],

    'ai_content_fallback' => [
        'enabled' => env('AI_CONTENT_FALLBACK_ENABLED', false),
        'provider' => env('AI_CONTENT_FALLBACK_PROVIDER', 'groq'),
        'base_url' => env('AI_CONTENT_FALLBACK_BASE_URL', 'https://api.groq.com/openai/v1'),
        'api_key' => env('AI_CONTENT_FALLBACK_API_KEY'),
        'model' => env('AI_CONTENT_FALLBACK_MODEL', 'llama-3.1-8b-instant'),
        'api_style' => env('AI_CONTENT_FALLBACK_API_STYLE', 'chat_completions'),
    ],

];
