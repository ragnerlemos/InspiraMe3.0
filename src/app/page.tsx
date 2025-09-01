"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, quotes } from "@/lib/dados";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Film } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Página principal que exibe uma lista de frases que podem ser filtradas e selecionadas.
export default function PhrasesPage() {
  // Estado para armazenar o termo de busca inserido pelo usuário.
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para armazenar a categoria de frase selecionada.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtra as frases com base no termo de busca e na categoria selecionada.
  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || quote.category === selectedCategory)
  );

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
            placeholder="Buscar por uma frase..."
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
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="group flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <p className="text-xl font-body italic">"{quote.text}"</p>
              <span className="mt-4 inline-block bg-muted px-2 py-1 text-xs rounded-full text-muted-foreground">{quote.category}</span>
            </CardContent>
            <div className="p-6 pt-0">
                <Link href={`/editor-de-video?quote=${encodeURIComponent(quote.text)}`} passHref>
                    <Button className="w-full" variant="secondary">
                        <Film className="mr-2 h-4 w-4"/>
                        Criar Vídeo
                    </Button>
                </Link>
            </div>
          </Card>
        ))}
      </div>
      {filteredQuotes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Nenhuma frase encontrada. Tente uma busca ou categoria diferente.</p>
        </div>
      )}
    </div>
  );
}
