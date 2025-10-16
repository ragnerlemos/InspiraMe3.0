
import { NextResponse } from 'next/server';
import { quotes } from '@/lib/quotes';

export async function GET(request: Request) {
    try {
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
        console.error('Error fetching quotes:', error);
        return NextResponse.json({ error: 'Error fetching quotes' }, { status: 500 });
    }
}
