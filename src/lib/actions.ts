'use server';

import { getAllQuotes as fetchAllQuotes } from './dados';

export async function getAllQuotes() {
  return await fetchAllQuotes();
}