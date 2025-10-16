
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAMES = ['Frases', 'Dias da Semana', 'Datas Comemorativas'];

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
});

interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

const mapRowToQuote = (row: any[], index: number, sheetName: string): QuoteWithAuthor | null => {
    const quoteText = row[5];
    if (!quoteText) {
        return null;
    }
    return {
        id: `${sheetName}-${index}`,
        quote: quoteText,
        author: row[9] || undefined,
        category: row[3] || 'Geral',
        subCategory: row[2] || undefined,
    };
};

export async function GET(request: Request) {
    try {
        if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
            return NextResponse.json({ error: 'Google Sheets API key or Spreadsheet ID is not configured.' }, { status: 500 });
        }

        const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        const valueRanges = response.data.valueRanges;
        if (!valueRanges) {
            return NextResponse.json([]);
        }
        
        const quotes: QuoteWithAuthor[] = [];
        valueRanges.forEach((range, sheetIndex) => {
            if (range.values) {
                for (let i = 1; i < range.values.length; i++) {
                    const quote = mapRowToQuote(range.values[i], i, SHEET_NAMES[sheetIndex]);
                    if (quote) {
                        quotes.push(quote);
                    }
                }
            }
        });
        
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const mainCategory = url.searchParams.get("mainCategory");

        let filteredQuotes = quotes;

        if (category) {
            filteredQuotes = quotes.filter(q => q.subCategory === category || q.category === category);
        }

        if (mainCategory) {
            filteredQuotes = quotes.filter(q => q.category === mainCategory);
        }

        return NextResponse.json(filteredQuotes);

    } catch (error) {
        console.error('Error fetching quotes from Google Sheets:', error);
        return NextResponse.json({ error: 'Error fetching quotes from Google Sheets' }, { status: 500 });
    }
}
