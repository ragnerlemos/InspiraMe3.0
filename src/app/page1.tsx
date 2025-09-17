
import { getQuoteData, getCategoriesFromQuotes } from '@/lib/dados';
import { HomePageClient } from './pages/page-home';

// Componente de Servidor: Busca os dados antes de renderizar a página.
export default async function HomePage() {
  // Busca os dados da planilha no lado do servidor.
  const { quotes } = await getQuoteData();
  
  // Extrai as categorias e subcategorias dos dados obtidos.
  const { mainCategories, subCategoriesByMain } = getCategoriesFromQuotes(quotes);

  return (
    <HomePageClient 
      initialQuotes={quotes}
      initialMainCategories={mainCategories}
      initialSubCategories={subCategoriesByMain}
    />
  );
}
