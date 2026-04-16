
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getSheetData, getAllQuotes } from '@/lib/dados';
import { FrasesClientPage } from './frases-client';
import { Skeleton } from '@/components/ui/skeleton';

// O componente de esqueleto para ser usado como fallback do Suspense.
function FrasesLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-8 md:items-start px-4">
      <aside className="hidden md:block">
        <div className="sticky top-24 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </aside>
      <div>
        <div className="w-full mb-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
            ))}
        </div>
      </div>
    </div>
  );
}


// This is a Server Component that fetches the initial data.
export default async function FrasesPage() {
  
  // Fetch all quotes and categories from the latest data.
  // The client component will handle all the dynamic filtering.
  const allQuotes = await getAllQuotes(true);
  // Usa getSheetData para obter a hierarquia completa
  const sheetData = await getSheetData(true);

  // Extrai somente as categorias internas para o menu,
  // removendo os nomes das abas como entradas principais.
  const mainCategories = ['Todos'];
  const categories: { [mainCategory: string]: string[] } = {};

  for (const sheetName in sheetData) {
      for (const mainCat in sheetData[sheetName]) {
          const normalizedMainCat = mainCat.trim();
          if (!mainCategories.includes(normalizedMainCat)) {
              mainCategories.push(normalizedMainCat);
          }
          if (!categories[normalizedMainCat]) {
              categories[normalizedMainCat] = [];
          }

          const normalizedSubCategories = sheetData[sheetName][mainCat]
              .map((subCat) => (typeof subCat === 'string' ? subCat.trim() : subCat))
              .filter((subCat) => typeof subCat === 'string' && subCat.length > 0 && subCat !== 'Todos');

          categories[normalizedMainCat] = [...new Set([...categories[normalizedMainCat], ...normalizedSubCategories])];
      }
  }

  return (
    <Suspense fallback={<FrasesLoadingSkeleton />}>
      <FrasesClientPage
        initialQuotes={allQuotes}
        initialMainCategories={mainCategories}
        initialSubCategories={categories}
      />
    </Suspense>
  );
}
