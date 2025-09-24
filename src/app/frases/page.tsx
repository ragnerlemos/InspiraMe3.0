
import { getCategories, getAllQuotes } from '@/lib/actions';
import { FrasesClientPage } from './frases-client';

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

// Componente de Servidor: Busca os dados iniciais antes de renderizar a página.
export default async function FrasesPage() {
  // Busca a hierarquia de categorias e as frases iniciais (todas)
  const [categories, initialQuotes] = await Promise.all([
    getCategories(),
    getAllQuotes(),
  ]);

  // Transforma o objeto de categorias em um array para o cliente.
  const mainCategories = ['Todos', ...Object.keys(categories)];
  const subCategories: CategoriesHierarchy = {};
  for(const cat in categories) {
    // A lógica de remover "Todos" agora fica no cliente
    subCategories[cat] = categories[cat];
  }

  return (
    <FrasesClientPage
      initialQuotes={initialQuotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategories}
    />
  );
}
