
import { getAllQuotes } from "@/lib/dados";
import { FavoritesClientPage } from './favoritos-client';

// Definindo o tipo aqui para evitar importação do server-side em componentes cliente.
interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

// Componente de Servidor: Busca todos os dados necessários antes de renderizar a página do cliente.
export default async function FavoritesPage() {
  
  const allQuotes: QuoteWithAuthor[] = await getAllQuotes();

  return (
    <FavoritesClientPage allQuotes={allQuotes} />
  );
}
