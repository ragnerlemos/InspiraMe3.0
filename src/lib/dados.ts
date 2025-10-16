
import { quotes } from './quotes';
import type { QuoteWithAuthor } from './quotes';

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

// Função para buscar todas as frases do arquivo local
export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    // Simula uma chamada assíncrona
    return Promise.resolve(quotes);
}

// Função para buscar as categorias a partir das frases locais
export async function getCategories(): Promise<CategoriesHierarchy> {
    const allQuotes = await getAllQuotes();
    const categories: CategoriesHierarchy = {};
    
    allQuotes.forEach(quote => {
        if (quote.category) {
            if (!categories[quote.category]) {
                categories[quote.category] = [];
            }
            if (quote.subCategory && !categories[quote.category].includes(quote.subCategory)) {
                categories[quote.category].push(quote.subCategory);
            }
        }
    });

    for(const cat in categories) {
        categories[cat] = ['Todos', ...categories[cat].sort()];
    }

    return categories;
}

// Função para buscar frases por subcategoria ou categoria principal
export async function getQuotesForCategory(category: string): Promise<QuoteWithAuthor[]> {
    const allQuotes = await getAllQuotes();
    return allQuotes.filter(q => q.subCategory === category || q.category === category);
}

// Função para buscar frases por categoria principal
export async function getQuotesForMainCategory(mainCategory: string): Promise<QuoteWithAuthor[]> {
    const allQuotes = await getAllQuotes();
    return allQuotes.filter(q => q.category === mainCategory);
}
