
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Heart, Search, Copy, Film, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { quotes, categories } from "@/lib/dados";
import type { Quote, Category } from "@/lib/dados";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Página principal que exibe uma lista de frases e permite ao usuário filtrá-las.
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Filtra as frases com base no termo de busca e na categoria selecionada.
  const filteredQuotes = useMemo(() => {
    return quotes.filter(
      (quote) =>
        (quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === "Todos" || quote.category === selectedCategory)
    );
  }, [searchTerm, selectedCategory]);
  
  // Função para copiar o texto de uma frase para a área de transferência.
  const handleCopy = (text: string, author: string) => {
    navigator.clipboard.writeText(`"${text}" - ${author}`);
    toast({
      title: "Copiado!",
      description: "A frase foi copiada para a sua área de transferência.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          {/* Cabeçalho da página com título e descrição. */}
          <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Inspire-se. Crie. Compartilhe.
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Encontre a frase perfeita para o seu próximo vídeo.
            </p>
          </div>

          {/* Controles de filtro (busca e categorias). */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por frases ou autores..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
               <Button
                  variant={selectedCategory === "Todos" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Todos")}
                  className="whitespace-nowrap"
                >
                  Todos
                </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid de frases filtradas. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote) => (
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
                         <Button variant="ghost" size="icon" onClick={() => toggleFavorite(quote.id)}>
                            <Heart className={cn("h-4 w-4", favorites.includes(quote.id) ? "text-red-500 fill-current" : "")} />
                        </Button>
                        <Link href={`/modelos?quote=${encodeURIComponent(quote.text)}`} passHref>
                           <Button variant="ghost" size="icon">
                               <Film className="h-4 w-4" />
                           </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(quote.text, quote.author)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Mensagem exibida quando nenhuma frase é encontrada. */}
          {filteredQuotes.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold">Nenhuma frase encontrada</h2>
              <p className="text-muted-foreground mt-2">
                Tente ajustar sua busca ou selecionar outra categoria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
