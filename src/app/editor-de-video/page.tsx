
import { Suspense } from 'react';
import { EditorClient } from './components/cliente-editor';
import { Skeleton } from '@/components/ui/skeleton';

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="container mx-auto py-8 flex flex-col items-center h-full">
            <Skeleton className="w-full max-w-sm aspect-[9/16] rounded-lg" />
            <div className="w-full max-w-sm mt-4">
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
        </div>
    );
}

// Página do editor de vídeo que usa Suspense para mostrar um fallback de carregamento.
// O Suspense aguarda o carregamento dinâmico dos dados (parâmetros da URL) dentro do EditorClient.
export default function EditorPage() {
    return (
         <div className="w-full h-screen fixed inset-0 bg-background">
            <Suspense fallback={<EditorSkeleton />}>
                <EditorClient />
            </Suspense>
        </div>
    )
}
