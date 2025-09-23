
import { getAllQuotes, type QuoteWithAuthor } from "@/lib/dados";
import { FavoritesClientPage } from './favoritos-client';

// Componente de Servidor: Busca todos os dados necessários antes de renderizar a página do cliente.
export default async function FavoritesPage() {
  
  const allQuotes = await getAllQuotes();

  return (
    <FavoritesClientPage allQuotes={allQuotes} />
  );
}
