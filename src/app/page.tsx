
import { HomePageClient } from '@/app/pages/page-home';
import { getQuoteData, getCategoriesFromQuotes } from '@/lib/dados';

// Página principal agora é um Server Component que busca os dados antes de renderizar.
export default async function HomePage() {
  // Busca os dados da planilha no servidor.
  const { quotes } = await getQuoteData();

  // Processa as categorias e subcategorias no servidor.
  const { mainCategories, subCategoriesByMain } = getCategoriesFromQuotes(quotes);

  // Passa os dados para o componente cliente, que cuidará da interatividade.
  return <HomePageClient 
    initialQuotes={quotes} 
    initialMainCategories={mainCategories}
    initialSubCategories={subCategoriesByMain}
  />;
}
