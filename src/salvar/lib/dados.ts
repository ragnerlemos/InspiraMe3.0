
"use server";

import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAMES = ['Frases', 'Dias da Semana', 'Datas Comemorativas'];

// Configure the sheets client to use an API Key
const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
});

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


// Função para mapear uma linha da planilha para um objeto Quote
const mapRowToQuote = (row: any[], index: number, sheetName: string): QuoteWithAuthor | null => {
    const quoteText = row[5];
    if (!quoteText) {
        return null; // Não retorna frases vazias
    }
    return {
        id: `${sheetName}-${index}`,
        quote: quoteText,
        author: row[9] || undefined,
        category: row[3] || 'Geral', // Categoria Principal
        subCategory: row[2] || undefined, // Subcategoria
    };
};

export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    try {
        if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
            console.warn('Google Sheets API key or Spreadsheet ID is not configured. Returning empty array.');
            return [];
        }

        const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        const valueRanges = response.data.valueRanges;
        if (!valueRanges) {
            return [];
        }
        
        const quotes: QuoteWithAuthor[] = [];
        valueRanges.forEach((range, sheetIndex) => {
            if (range.values) {
                 // Começa do 1 para pular o cabeçalho
                for (let i = 1; i < range.values.length; i++) {
                    const quote = mapRowToQuote(range.values[i], i, SHEET_NAMES[sheetIndex]);
                    if (quote) {
                        quotes.push(quote);
                    }
                }
            }
        });
        return quotes;

    } catch (error) {
        console.error('Error fetching quotes from Google Sheets:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

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

    // Adiciona "Todos" e ordena as subcategorias
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
