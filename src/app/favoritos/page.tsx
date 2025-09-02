
"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { quotes } from "@/lib/dados";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Copy, Trash2, Share2, HeartCrack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Página para exibir as frases favoritas do usuário.
export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { toast } = useToast();

  // Filtra as frases da lista principal para obter apenas as favoritas.
  const favoriteQuotes = quotes.filter((quote) => favorites.includes(quote.id));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "A frase foi copiada para a área de transferência.",
    });
  };

  const handleRemove = (id: number) => {
    removeFavorite(id);
    toast({
      title: "Removido!",
      description: "A frase foi removida dos seus favoritos.",
    });
  };

  return (
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
                <p className="text-xl font-body italic">"{quote.text}"</p>
                <p className="text-right text-sm font-medium text-muted-foreground mt-4">
                  - {quote.author}
                </p>
              </CardContent>
              <CardFooter className="px-6 pb-4 flex justify-between items-center">
                <span className="bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">
                  {quote.category}
                </span>
                <div className="flex items-center">
                  <Link href={`/galeria?quote=${encodeURIComponent(quote.text)}`} passHref>
                    <Button variant="ghost" size="icon">
                        <Film className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(`"${quote.text}" - ${quote.author}`)}
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
  );
}
