
// Componente para a aba "Fundo", permitindo o upload de imagem ou vídeo.

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import type { PainelFundoProps } from './tipos';

export function PainelFundo({ onBackgroundImageChange }: PainelFundoProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Verifica o tipo do arquivo
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            toast({
                variant: "destructive",
                title: "Arquivo Inválido",
                description: "Por favor, selecione um arquivo de imagem ou vídeo.",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                onBackgroundImageChange(result);
            }
        };
        reader.onerror = () => {
             toast({
                variant: "destructive",
                title: "Erro ao Carregar",
                description: "Houve um problema ao ler o arquivo selecionado.",
            });
        }
        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <Label>Mídia de Fundo</Label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
                id="background-upload"
            />
            <Button onClick={handleButtonClick} className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Carregar Imagem ou Vídeo
            </Button>
            <p className="text-xs text-muted-foreground text-center">
                Selecione um arquivo do seu dispositivo para usar como fundo.
            </p>
        </div>
    );
}
