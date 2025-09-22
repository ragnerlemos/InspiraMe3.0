
"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { getAllQuotes, type QuoteWithAuthor } from "@/lib/dados";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Copy, Trash2, Share2, HeartCrack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo } from "react";


// Página para exibir as frases favoritas do usuário.
export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { toast } = useToast();
  const [allQuotes, setAllQuotes] = useState<QuoteWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca todas as frases uma vez para poder encontrar as favoritas.
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const quotes = await getAllQuotes();
        setAllQuotes(quotes);
      } catch (error) {
        console.error("Failed to load all quotes for favorites", error);
        toast({ variant: 'destructive', title: "Erro ao Carregar", description: "Não foi possível carregar as frases." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [toast]);
  
  const favoriteQuotes = useMemo(() => {
    return allQuotes.filter(quote => favorites.includes(quote.id));
  }, [allQuotes, favorites]);


  const handleCopy = (text: string, author?: string) => {
    try {
      const textToCopy = author ? `${text} - ${author}` : text;
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copiado!",
        description: "A frase foi copiada para a área de transferência.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar a frase.",
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

  if (isLoading) {
    return (
       <main className="overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Minhas Frases Favoritas
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Carregando sua coleção pessoal de inspiração...
            </p>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-40 animate-pulse bg-muted"></Card>
                ))}
            </div>
        </div>
      </main>
    )
  }

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

        {favoriteQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 pb-2">
                  <p className="text-xl font-body italic">"{quote.quote}"</p>
                  {quote.author && (
                     <p className="text-right text-sm font-medium text-muted-foreground mt-4">
                        - {quote.author}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="px-6 pb-4 flex justify-end items-center">
                  <div className="flex items-center">
                    <Link href={`/modelos?quote=${encodeURIComponent(quote.quote)}`} passHref>
                      <Button variant="ghost" size="icon">
                          <Film className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(quote.quote, quote.author)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(quote.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
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
            <Link href="/" passHref>
              <Button>Encontrar Inspiração</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
