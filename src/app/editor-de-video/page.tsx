
import { Suspense } from 'react';
import { EditorClient } from './components/cliente-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/app/cabecalho-app';

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="flex flex-col md:flex-row h-full w-full">
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/40">
                <Skeleton className="w-full max-w-sm aspect-[9/16] rounded-lg" />
            </div>
            <div className="w-full md:w-80 lg:w-96 bg-background border-l">
                 <div className="p-4">
                    <Skeleton className="h-24 w-full" />
                 </div>
                 <div className="p-4 border-t">
                     <Skeleton className="h-20 w-full" />
                 </div>
            </div>
        </div>
    );
}

// Página do editor de vídeo que usa Suspense para mostrar um fallback de carregamento.
// O Suspense aguarda o carregamento dinâmico dos dados (parâmetros da URL) dentro do EditorClient.
export default function EditorPage() {
    return (
         <div className="w-full h-full flex flex-col">
            <AppHeader />
            <main className="flex-1 min-h-0">
                <Suspense fallback={<EditorSkeleton />}>
                    <EditorClient />
                </Suspense>
            </main>
        </div>
    )
}
