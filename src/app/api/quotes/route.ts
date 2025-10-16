
import { NextResponse } from 'next/server';
import { getAllQuotes } from '@/lib/dados';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const mainCategory = url.searchParams.get("mainCategory");

        let quotes = await getAllQuotes();

        if (category) {
            quotes = quotes.filter(q => q.subCategory === category || q.category === category);
        }

        if (mainCategory) {
            quotes = quotes.filter(q => q.category === mainCategory);
        }

        return NextResponse.json(quotes);

    } catch (error)
        {
        console.error('Error fetching quotes:', error);
        // Se houver um erro, retorne um array vazio ou uma mensagem de erro.
        // Evite retornar um erro 500 genérico se possível.
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}
