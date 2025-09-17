
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Página raiz que redireciona para /frases.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/frases');
  }, [router]);

  // Exibe um loader enquanto o redirecionamento acontece.
  return (
    <div className="flex flex-col h-full w-full items-center justify-center space-y-6 p-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="w-full space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    </div>
  );
}
