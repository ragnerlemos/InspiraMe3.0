// Componente de ícone para representar um gradiente, pois não existe um no Lucide.
export function IconeGradiente({ className }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
                    <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <rect width="24" height="24" fill="url(#grad1)" />
        </svg>
    );
}
