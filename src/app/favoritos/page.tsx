import { FavoritesClientPage } from './favoritos-client';
import { getAllQuotes } from '@/lib/dados';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const allQuotes = await getAllQuotes();
  return (
    <FavoritesClientPage allQuotes={allQuotes} />
  );
}
