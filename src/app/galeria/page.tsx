
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { templates } from '@/lib/dados';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FilePlus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Página que exibe uma galeria de modelos de vídeo que os usuários podem utilizar.
export default function TemplatesPage() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const editorUrl = new URLSearchParams();
          editorUrl.set('templateId', template.id.toString());
          if (quote) {
            editorUrl.set('quote', quote);
          }
          
          return (
            <Card key={template.id} className="overflow-hidden group">
                <div className={cn(
                    "relative", 
                    template.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square',
                    template.id === -1 && 'bg-muted'
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
                    <div className="flex items-center justify-center h-full bg-muted">
                        {template.id === -2 ? (
                            <User className="h-24 w-24 text-muted-foreground/50" />
                        ) : (
                            <FilePlus className="h-24 w-24 text-muted-foreground/50" />
                        )}
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Link para o editor, passando o ID do modelo como parâmetro. */}
                    <Link href={`/editor-de-video?${editorUrl.toString()}`} passHref>
                        <Button>
                            <Eye className="mr-2 h-4 w-4" />
                            Usar Modelo
                        </Button>
                    </Link>
                </div>
                </div>
                <CardContent className="p-4 bg-card">
                <p className="font-medium font-headline">{template.name}</p>
                <p className="text-sm text-muted-foreground">Proporção: {template.aspectRatio}</p>
                </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
