
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard, PlusCircle } from "lucide-react";
import { useMyVideos } from "@/hooks/use-my-videos";

// Página para exibir os vídeos salvos pelo usuário.
export default function MyVideosPage() {
  const { savedVideos } = useMyVideos();

  return (
    <main className="flex-1">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Meus Vídeos
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Sua galeria de criações prontas para compartilhar com o mundo.
          </p>
        </div>

        {savedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mapeamento dos vídeos salvos virá aqui */}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
            <Clapperboard className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum vídeo salvo ainda</h2>
            <p className="text-muted-foreground mb-6">
              Vá para o editor e crie seu primeiro vídeo para vê-lo aqui.
            </p>
            <Link href="/editor-de-video" passHref>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Vídeo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
