import { Suspense } from 'react';
import { EditorClient } from '@/components/cliente-editor';
import { Skeleton } from '@/components/ui/skeleton';

// Componente que exibe um esqueleto de carregamento enquanto o editor está sendo preparado.
function EditorSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                    </div>
                    <Skeleton className="w-full max-w-2xl aspect-[9/16] rounded-lg" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="w-full h-[700px] rounded-lg" />
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
