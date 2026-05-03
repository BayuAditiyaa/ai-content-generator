import { useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';

export default function TurnstileWidget({ siteKey, onVerify, resetKey = 0 }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onVerifyRef = useRef(onVerify);

    useEffect(() => {
        onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
        if (!siteKey || !containerRef.current) {
            return undefined;
        }

        let cancelled = false;

        const renderWidget = () => {
            if (cancelled || !window.turnstile || !containerRef.current) {
                return;
            }

            containerRef.current.innerHTML = '';
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token) => onVerifyRef.current(token),
                'expired-callback': () => onVerifyRef.current(''),
                'error-callback': () => onVerifyRef.current(''),
            });
        };

        if (window.turnstile) {
            renderWidget();
        } else {
            let script = document.getElementById(TURNSTILE_SCRIPT_ID);

            if (!script) {
                script = document.createElement('script');
                script.id = TURNSTILE_SCRIPT_ID;
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }

            script.addEventListener('load', renderWidget);

            return () => {
                cancelled = true;
                script.removeEventListener('load', renderWidget);

                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.remove(widgetIdRef.current);
                }
            };
        }

        return () => {
            cancelled = true;

            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, [resetKey, siteKey]);

    return <div ref={containerRef} />;
}
