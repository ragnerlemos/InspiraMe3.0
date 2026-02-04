
"use client";

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
        onSaveProject,
        onExportJPG,
        onExportPNG,
        onExportMP4,
    } = useEditor();
    const { toast } = useToast();

    const handleSave = () => {
        onSaveProject();
    }

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
                <DropdownMenuItem onClick={() => onExportPNG(false)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Exportar como PNG</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => onExportPNG(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Compartilhar PNG</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportMP4}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Exportar como MP4</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  );
}
