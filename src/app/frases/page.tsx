
import { getCategories, getAllQuotes, getQuotesForMainCategory } from '@/lib/dados';
import { FrasesClientPage } from './frases-client';
import type { CategoriesHierarchy } from '@/lib/dados';

// Props que este componente de servidor pode receber do layout
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
    subCategories[cat] = categories[cat].filter(sub => sub !== 'Todos');
  }

  return (
    <FrasesClientPage
      initialQuotes={initialQuotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategories}
      // Repassa as props recebidas do AppLayout para o componente cliente
      isCategorySheetOpen={isCategorySheetOpen}
      setIsCategorySheetOpen={setIsCategorySheetOpen}
    />
  );
}
