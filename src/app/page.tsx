
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Feather } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Página raiz que exibe uma tela de boas-vindas e redireciona.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
        router.replace('/frases');
    }, 3000); // 3 segundos

    // Limpa o timer se o componente for desmontado antes do tempo
    return () => clearTimeout(timer);
  }, [router]);

  // Exibe uma animação de carregamento/boas-vindas enquanto espera o redirecionamento.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
        <div className="animate-pulse">
            <Feather className="h-20 w-20 text-primary" />
        </div>
        <h1 className="mt-8 font-headline text-4xl font-bold text-foreground md:text-5xl">
            InspireMe
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Carregando sua dose diária de inspiração...
        </p>
    </div>
  );
}
