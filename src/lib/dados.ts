
export interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

// Função para buscar todas as frases da nova API route
export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    try {
        // Usa um timestamp para evitar o cache em ambientes de desenvolvimento
        const response = await fetch(`/api/quotes?_=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quotes = await response.json();
        return quotes;
    } catch (error) {
        console.error('Error fetching all quotes:', error);
        return [];
    }
}

// Função para buscar as categorias
export async function getCategories(): Promise<CategoriesHierarchy> {
    const quotes = await getAllQuotes();
    const categories: CategoriesHierarchy = {};
    
    quotes.forEach(quote => {
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
    try {
        const response = await fetch(`/api/quotes?category=${encodeURIComponent(category)}&_=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quotes = await response.json();
        return quotes;
    } catch (error) {
        console.error(`Error fetching quotes for category ${category}:`, error);
        return [];
    }
}

// Função para buscar frases por categoria principal
export async function getQuotesForMainCategory(mainCategory: string): Promise<QuoteWithAuthor[]> {
    try {
        const response = await fetch(`/api/quotes?mainCategory=${encodeURIComponent(mainCategory)}&_=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quotes = await response.json();
        return quotes;
    } catch (error) {
        console.error(`Error fetching quotes for main category ${mainCategory}:`, error);
        return [];
    }
}
