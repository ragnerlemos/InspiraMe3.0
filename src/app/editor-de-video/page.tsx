
import { Suspense } from 'react';
import { EditorClient } from './components/cliente-editor';
import { Skeleton } from '@/components/ui/skeleton';

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col items-center gap-8">
                <Skeleton className="w-full max-w-md aspect-[9/16] rounded-lg" />
                <Skeleton className="w-full max-w-md h-24 rounded-lg" />
            </div>
        </div>
    );
}

// Página do editor de vídeo que usa Suspense para mostrar um fallback de carregamento.
// O Suspense aguarda o carregamento dinâmico dos dados (parâmetros da URL) dentro do EditorClient.
export default function EditorPage() {
    return (
         <div className="w-full h-[calc(100vh-4rem)]">
            <Suspense fallback={<EditorSkeleton />}>
                <EditorClient />
            </Suspense>
        </div>
    )
}