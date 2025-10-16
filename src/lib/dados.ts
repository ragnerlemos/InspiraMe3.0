
import { quotes } from './quotes';
import type { QuoteWithAuthor } from './quotes';

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    return Promise.resolve(quotes);
}

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

export async function getQuotesForCategory(category: string): Promise<QuoteWithAuthor[]> {
    const allQuotes = await getAllQuotes();
    return allQuotes.filter(q => q.subCategory === category || q.category === category);
}

export async function getQuotesForMainCategory(mainCategory: string): Promise<QuoteWithAuthor[]> {
    const allQuotes = await getAllQuotes();
    return allQuotes.filter(q => q.category === mainCategory);
}
