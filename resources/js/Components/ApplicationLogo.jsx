export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="promptpilot-gradient" x1="12" y1="8" x2="58" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F766E" />
                    <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
            </defs>
            <rect x="6" y="6" width="60" height="60" rx="18" fill="url(#promptpilot-gradient)" />
            <path
                d="M24 22h13.5c8.6 0 14.5 5.4 14.5 13.3S46.1 49 37.5 49H32v9H24V22Zm8 19h5.1c4.4 0 7-2.1 7-5.7s-2.6-5.6-7-5.6H32v11.3Z"
                fill="#FFF9F0"
            />
            <path
                d="M49 49c2.6 0 4.8 2.2 4.8 4.9S51.6 59 49 59s-4.8-2.1-4.8-5.1S46.4 49 49 49Z"
                fill="#FFF9F0"
            />
        </svg>
    );
}
