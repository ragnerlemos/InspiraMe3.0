

import { getAllQuotes, getCategoriesFromQuotes } from '@/lib/dados';
import { FrasesClientPage } from './frases-client';


// Componente de Servidor: Busca os dados antes de renderizar a página.
export default async function FrasesPage() {
  // Busca os dados da planilha no lado do servidor.
  const quotes = await getAllQuotes();
  
  // Extrai as categorias e subcategorias dos dados obtidos.
  const { mainCategories, subCategoriesByMain } = getCategoriesFromQuotes(quotes);

  return (
    <FrasesClientPage
      initialQuotes={quotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategoriesByMain}
    />
  );
}
