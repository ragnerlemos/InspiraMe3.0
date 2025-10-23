'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from "@/hooks/use-favorites";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Copy, Trash2, Share2, HeartCrack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
}

interface FavoritesClientPageProps {
  allQuotes: QuoteWithAuthor[];
}

export function FavoritesClientPage({ allQuotes }: FavoritesClientPageProps) {
  const { favorites, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  const [favoriteQuotes, setFavoriteQuotes] = useState<QuoteWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (allQuotes) {
      const userFavorites = allQuotes.filter(quote => favorites.includes(quote.id));
      setFavoriteQuotes(userFavorites);
    }
    setIsLoading(false);
  }, [favorites, allQuotes]);

  const handleCopy = (text: string, author?: string) => {
    const textToCopy = author ? `${text} - ${author}` : text;
    try {
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copiado!",
        description: "A frase foi copiada para a área de transferência.",
      });
    } catch (err) {
      console.error('Falha ao copiar:', err);
      toast({
        title: 'Erro ao Copiar',
        description: 'Não foi possível copiar para a área de transferência.',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = (id: string) => {
    removeFavorite(id);
    toast({
      title: "Removido!",
      description: "A frase foi removida dos seus favoritos.",
    });
  };

  const handleShare = async (text: string, author?: string) => {
    const shareText = author ? `${text} - ${author}` : text;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'InspireMe', text: shareText });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error("Erro ao compartilhar, usando fallback de cópia:", error);
        handleCopy(text, author);
      }
    } else {
      handleCopy(text, author);
    }
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 pb-0">
                    <Skeleton className="h-16 w-full" />
                </CardContent>
                <CardFooter className="p-4 pt-2 flex flex-col items-end gap-2">
                    <Skeleton className="h-4 w-1/3" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Minhas Frases Favoritas
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Sua coleção pessoal de inspiração, pronta para criar.
          </p>
        </div>

        {isLoading ? renderSkeletons() : favoriteQuotes.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteQuotes.map((quote) => (
                  <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4 pb-0 flex-1">
                          <p className="text-base font-body">{quote.quote}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-2 flex flex-col items-end gap-2">
                          {quote.author && (
                              <p className="text-sm font-medium text-muted-foreground">
                                  - {quote.author}
                              </p>
                          )}
                          <div className="flex justify-between items-center w-full pt-1">
                              {quote.subCategory && quote.subCategory !== 'Todos' ? (
                                  <span className="bg-primary/10 px-2 py-0.5 text-xs rounded-full text-primary truncate max-w-[120px]">
                                      {quote.subCategory}
                                  </span>
                              ) : <div />}

                              <div className="flex items-center">
                                  <Link href={`/editor-de-video?quote=${encodeURIComponent(quote.quote)}`} passHref>
                                      <Button variant="ghost" size="icon"><Film className="h-4 w-4" /></Button>
                                  </Link>
                                  <Button variant="ghost" size="icon" onClick={() => handleCopy(quote.quote, quote.author)}>
                                      <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleRemove(quote.id)}>
                                      <Trash2 className={cn("h-4 w-4 text-destructive")} />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleShare(quote.quote, quote.author)}>
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>
                      </CardFooter>
                  </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
              <HeartCrack className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhuma frase favorita ainda</h2>
            <p className="text-muted-foreground mb-6">
              Clique no ícone de coração (❤️) em uma frase para adicioná-la aqui.
            </p>
            <Link href="/frases" passHref>
              <Button>Encontrar Inspiração</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
