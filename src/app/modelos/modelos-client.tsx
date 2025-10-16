'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { Card, CardContent } from '@/components/ui/card';
import { FilePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { IconeTwitter } from './icone-twitter';
import { IconeModeloPadrao } from './icone-modelo-padrao';

function TemplateSkeleton() {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
                 <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-lg"></div>
                    <CardContent className="p-2 space-y-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Página que exibe uma galeria de modelos de vídeo que os usuários podem utilizar.
export default function ModelosClientPage() {
    const searchParams = useSearchParams();
    const quote = searchParams.get('quote');
    const { templates, removeTemplate, isLoaded } = useTemplates();
    const { toast } = useToast();

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        removeTemplate(id);
        toast({ title: "Modelo excluído!", description: "O modelo foi removido da sua coleção." });
    };

    if (!isLoaded) {
        return (
             <main className="overflow-y-auto">
                <div className="container mx-auto py-8 px-4">
                    <div className="text-center mb-8">
                        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Modelos</h1>
                        <p className="text-muted-foreground mt-2 text-lg">Carregando seus modelos...</p>
                    </div>
                   <TemplateSkeleton />
                </div>
            </main>
        )
    }

    const customTemplates = templates.filter(t => t.isCustom);
    const defaultTemplates = templates.filter(t => !t.isCustom);

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Modelos
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Escolha um modelo projetado profissionalmente para iniciar sua criação.
          </p>
        </div>

        {/* Modelos Customizados */}
        {customTemplates.length > 0 && (
            <div className="mb-12">
                 <h2 className="text-2xl font-headline font-bold mb-4">Meus Modelos</h2>
                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {customTemplates.map((template) => {
                        const editorUrl = new URLSearchParams();
                        editorUrl.set('templateId', template.id);
                        if (quote) editorUrl.set('quote', quote);

                        return (
                            <Link key={template.id} href={`/editor-de-video?${editorUrl.toString()}`} passHref className="group">
                                <Card className="overflow-hidden flex flex-col h-full relative">
                                    {template.isCustom && (
                                       <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} // Impede a navegação
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o seu modelo "{template.name}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={(e) => handleRemove(e, template.id)}>Excluir</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    <div className="relative w-full aspect-square">
                                        <Image
                                            src={template.thumbnail!}
                                            alt={template.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <CardContent className="p-2 bg-card">
                                        <p className="font-normal text-xs">{template.name}</p>
                                        {template.createdAt && <p className="text-[10px] text-muted-foreground">{new Date(template.createdAt).toLocaleDateString()}</p>}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                 </div>
            </div>
        )}

        {/* Modelos Padrão */}
        <div>
             <h2 className="text-2xl font-headline font-bold mb-4">Modelos Padrão</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {defaultTemplates.map((template) => {
                  const editorUrl = new URLSearchParams();
                  editorUrl.set('templateId', template.id.toString());
                  if (quote) {
                    editorUrl.set('quote', quote);
                  }
                  
                  return (
                    <Link key={template.id} href={`/editor-de-video?${editorUrl.toString()}`} passHref className="group">
                        <Card className="overflow-hidden flex flex-col h-full">
                        <div className={cn(
                            "relative w-full aspect-square"
                        )}>
                            {template.id === 'template-twitter' ? (
                                <div className="flex items-center justify-center h-full bg-muted transition-colors group-hover:bg-muted/80 p-4">
                                    <IconeTwitter className="h-full w-full text-muted-foreground/80" />
                                </div>
                            ) : template.id === 'template-default' ? (
                                <div className="flex items-center justify-center h-full bg-muted transition-colors group-hover:bg-muted/80 p-4">
                                    <IconeModeloPadrao className="h-1/2 w-1/2 text-muted-foreground/80" />
                                </div>
                            ) : template.thumbnail ? (
                                <Image
                                    src={template.thumbnail}
                                    alt={template.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted transition-colors group-hover:bg-muted/80">
                                    <FilePlus className="h-16 w-16 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <CardContent className="p-2 bg-card">
                            <p className="font-normal text-xs">{template.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                                Proporção: {template.editorState.aspectRatio}
                            </p>
                        </CardContent>
                        </Card>
                    </Link>
                  )
                })}
              </div>
        </div>

        {templates.length === 0 && !isLoaded && <p>Carregando modelos...</p>}
        {templates.length === 0 && isLoaded && (
            <div className="text-center py-16">
                 <h2 className="text-2xl font-bold mb-2">Nenhum modelo encontrado</h2>
                 <p className="text-muted-foreground">Crie seu primeiro modelo no editor para vê-lo aqui.</p>
            </div>
        )}

      </div>
    </main>
  );
}
