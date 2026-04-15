
"use client";

import { useEffect, useState } from "react";
import {
  Download, MoreVertical, Undo2, Redo2, Save, FilePlus, FolderUp, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useEditor } from "../contexts/editor-context";
import { useToast } from "@/hooks/use-toast";

export function EditorActions() {
    const { 
        canUndo, undo, 
        canRedo, redo, 
        onSaveAsTemplate,
        onExportJPG,
        onExportPNG,
        onExportMP4,
    } = useEditor();
    const { toast } = useToast();
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [videoPreview, setVideoPreview] = useState<{ url: string; blob: Blob } | null>(null);

    useEffect(() => {
      return () => {
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview.url);
        }
      };
    }, [videoPreview]);

    const handleSave = () => {
        // Lógica de salvamento será implementada aqui
        toast({ title: 'Projeto Salvo!'});
    }

    const handleExportMP4 = async () => {
        if (isGeneratingVideo) return;
        toast({ title: 'Gerando vídeo...', description: 'Aguarde enquanto o vídeo é preparado.' });
        setIsGeneratingVideo(true);
        const blob = await onExportMP4();
        setIsGeneratingVideo(false);

        if (!blob) return;

        const url = URL.createObjectURL(blob);
        setVideoPreview({ url, blob });
    };

    const closeVideoPreview = () => {
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview.url);
        }
        setVideoPreview(null);
    };

    const downloadVideoPreview = () => {
        if (!videoPreview) return;

        const extension = videoPreview.blob.type.includes('mp4') ? 'mp4' : 'webm';
        const link = document.createElement('a');
        link.href = videoPreview.url;
        link.download = `inspire-me-export-${Date.now()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <>
        <div className="hidden md:flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Desfazer">
                <Undo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Refazer">
                <Redo2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={handleSave}>
                <Save className="h-5 w-5 mr-2" />
                Salvar
            </Button>
        </div>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Download className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSave} className="md:hidden">
                    <Save className="mr-2 h-4 w-4" />
                    <span>Salvar Projeto</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => toast({ title: "Em breve!", description: "A função 'Salvar Como' será adicionada."})}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    <span>Salvar Como...</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem onClick={onSaveAsTemplate}>
                    <FolderUp className="mr-2 h-4 w-4" />
                    <span>Salvar como Modelo</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onExportJPG}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Exportar como JPG</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportPNG}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Exportar como PNG</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMP4}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>{isGeneratingVideo ? 'Gerando MP4...' : 'Exportar como MP4'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {videoPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-background shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
                <div>
                  <p className="text-base font-semibold">Pré-visualização do vídeo</p>
                  <p className="text-sm text-muted-foreground">Veja o resultado antes de baixar.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={closeVideoPreview}>
                  <span className="sr-only">Fechar pré-visualização</span>
                  ×
                </Button>
              </div>
              <div className="p-4">
                <video
                  src={videoPreview.url}
                  controls
                  autoPlay
                  className="w-full rounded-2xl bg-black"
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 border-t px-4 py-3">
                <Button onClick={downloadVideoPreview}>Baixar vídeo</Button>
                <Button variant="secondary" onClick={closeVideoPreview}>Fechar</Button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
