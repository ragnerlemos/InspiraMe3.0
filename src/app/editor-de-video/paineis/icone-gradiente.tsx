// Componente SVG para exibir um ícone de gradiente.

interface IconeGradienteProps {
    className?: string;
}
  
export function IconeGradiente({ className }: IconeGradienteProps) {
    const id = "grad-icon";
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" className={className}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect width="20" height="20" fill={`url(#${id})`} />
      </svg>
    );
}
