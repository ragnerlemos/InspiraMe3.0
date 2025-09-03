
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { templates } from '@/lib/dados';
import { Card, CardContent } from '@/components/ui/card';
import { FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Página que exibe uma galeria de modelos de vídeo que os usuários podem utilizar.
export default function ModelosPage() {
    const searchParams = useSearchParams();
    const quote = searchParams.get('quote');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Modelos
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Escolha um modelo projetado profissionalmente para iniciar sua criação.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => {
          const editorUrl = new URLSearchParams();
          editorUrl.set('templateId', template.id.toString());
          if (quote) {
            editorUrl.set('quote', quote);
          }
          
          return (
            <Link key={template.id} href={`/editor-de-video?${editorUrl.toString()}`} passHref className="group">
                <Card className="overflow-hidden flex flex-col h-full">
                <div className={cn(
                    "relative w-full", 
                    template.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'
                )}>
                    {template.imageUrl ? (
                        <Image
                            src={template.imageUrl}
                            alt={template.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={template.dataAiHint}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted transition-colors group-hover:bg-muted/80">
                            <FilePlus className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
                <CardContent className="p-2 bg-card">
                    <p className="font-normal text-[11px]">{template.name}</p>
                    <p className="text-[11px] text-muted-foreground">Proporção: {template.aspectRatio}</p>
                </CardContent>
                </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
