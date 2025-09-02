
"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, quotes } from "@/lib/dados";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Film, Copy, Heart, Share2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useFavorites } from "@/hooks/use-favorites";

// Página principal que exibe uma lista de frases que podem ser filtradas e selecionadas.
export default function PhrasesPage() {
  // Estado para armazenar o termo de busca inserido pelo usuário.
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para armazenar a categoria de frase selecionada.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const { favorites, toggleFavorite } = useFavorites();


  // Filtra as frases com base no termo de busca e na categoria selecionada.
  const filteredQuotes = quotes.filter(
    (quote) =>
      (quote.text.toLowerCase().includes(searchTerm.toLowerCase()) || quote.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || quote.category === selectedCategory)
  );
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copiado!",
        description: "A frase foi copiada para a área de transferência.",
    })
  }

  const handleFavoriteClick = (id: number) => {
    const isFavorited = favorites.includes(id);
    toggleFavorite(id);
    toast({
        title: isFavorited ? "Removido!" : "Favoritado!",
        description: isFavorited ? "A frase foi removida dos favoritos." : "A frase foi adicionada aos favoritos.",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Encontre Sua Inspiração
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Navegue por nossa coleção de frases e crie seu próximo vídeo viral.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por frase ou autor..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
        <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-4">
                    <Button
                        variant={!selectedCategory ? "default" : "outline"}
                        onClick={() => setSelectedCategory(null)}
                        className="rounded-full"
                    >
                        Todas
                    </Button>
                    {categories.map((category) => (
                        <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full"
                        >
                        {category}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => {
          const isFavorited = favorites.includes(quote.id);
          return (
            <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 pb-2">
                <p className="text-xl font-body italic">"{quote.text}"</p>
                <p className="text-right text-sm font-medium text-muted-foreground mt-4">- {quote.author}</p>
              </CardContent>
              <CardFooter className="px-6 pb-4 flex justify-between items-center">
                  <span className="bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">{quote.category}</span>
                  <div className="flex items-center">
                    <Link href={`/galeria?quote=${encodeURIComponent(quote.text)}`} passHref>
                        <Button variant="ghost" size="icon"><Film className="h-4 w-4"/></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(`"${quote.text}" - ${quote.author}`)}><Copy className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleFavoriteClick(quote.id)}>
                        <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-current' : ''}`}/>
                    </Button>
                    <Button variant="ghost" size="icon"><Share2 className="h-4 w-4"/></Button>
                  </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {filteredQuotes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Nenhuma frase encontrada. Tente uma busca ou categoria diferente.</p>
        </div>
      )}
    </div>
  );
}
