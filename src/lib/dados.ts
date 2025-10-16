
import { quotes } from './quotes';
import type { QuoteWithAuthor } from './quotes';

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

export function getAllQuotes(): QuoteWithAuthor[] {
    return quotes;
}

export function getCategories(): CategoriesHierarchy {
    const allQuotes = getAllQuotes();
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
