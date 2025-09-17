
import { getCategories, getAllQuotes } from '@/lib/dados';
import { FrasesClientPage } from './frases-client';
import type { CategoriesHierarchy } from '@/lib/dados';

interface FrasesPageProps {
  isCategorySheetOpen?: boolean;
  setIsCategorySheetOpen?: (isOpen: boolean) => void;
}

// Componente de Servidor: Busca os dados iniciais antes de renderizar a página.
export default async function FrasesPage({ isCategorySheetOpen, setIsCategorySheetOpen }: FrasesPageProps) {
  // Busca a hierarquia de categorias e as frases iniciais (todas)
  const [categories, initialQuotes] = await Promise.all([
    getCategories(),
    getAllQuotes(),
  ]);

  // Transforma o objeto de categorias em um array para o cliente.
  const mainCategories = ['Todos', ...Object.keys(categories)];
  const subCategories: CategoriesHierarchy = {};
  for(const cat in categories) {
    subCategories[cat] = [...categories[cat]];
  }

  return (
    <FrasesClientPage
      initialQuotes={initialQuotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategories}
      isCategorySheetOpen={isCategorySheetOpen}
      setIsCategorySheetOpen={setIsCategorySheetOpen}
    />
  );
}
