
import { Suspense } from 'react';
import ModelosClientPage, { TemplateSkeleton } from './modelos-client';

// Página que exibe uma galeria de modelos de vídeo que os usuários podem utilizar.
export default function ModelosPage() {
  return (
    <Suspense fallback={<TemplateSkeleton />}>
      <ModelosClientPage />
    </Suspense>
  );
}
