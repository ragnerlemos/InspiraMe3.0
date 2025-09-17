
import { Suspense } from 'react';
import { EditorClient } from '@/app/editor-de-video/components/cliente-editor';
import { Skeleton } from '@/components/ui/skeleton';

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="flex flex-col md:flex-row w-full flex-1 min-h-0">
            <div className="flex-1 flex items-center justify-center bg-muted/40 p-4">
                <Skeleton className="w-full max-w-sm aspect-[9/16] rounded-lg" />
            </div>
            <div className="w-full md:w-80 lg:w-96 bg-background border-t md:border-t-0 md:border-l">
                 <div className="p-4">
                    <Skeleton className="h-24 w-full" />
                 </div>
                 <div className="p-4 border-t">
                     <Skeleton className="h-40 w-full" />
                 </div>
            </div>
        </div>
    );
}

// Página do editor de vídeo que usa Suspense para mostrar um fallback de carregamento.
export default function EditorPage() {
    return (
        <Suspense fallback={<EditorSkeleton />}>
            <EditorClient />
        </Suspense>
    )
}
