"use client";

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, User, AtSign, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AssinaturaPerfil } from '../editor-de-video/modelos/assinatura-perfil';
import { Skeleton } from '@/components/ui/skeleton';

// Componente de pré-visualização da assinatura
function AssinaturaPreview({ profile, showPhoto, showUsername, showSocial }: {
  profile: ReturnType<typeof useProfile>['profile'];
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
}) {
  return (
    <div id="signature-export-preview" className="bg-gray-800 p-4 inline-block rounded-lg">
      <AssinaturaPerfil 
        profile={profile}
        showPhoto={showPhoto}
        showUsername={showUsername}
        showSocial={showSocial}
        showBackground={false} // Fundo transparente para a pré-visualização
        bgColor=""
        bgOpacity={0}
      />
    </div>
  );
}

// Página principal do módulo de Assinatura
export default function AssinaturaPage() {
  const { profile, isLoaded } = useProfile();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [showPhoto, setShowPhoto] = useState(true);
  const [showUsername, setShowUsername] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById('signature-export-preview');
    if (!element) {
        toast({
            variant: "destructive",
            title: "Erro na Exportação",
            description: "Não foi possível encontrar a área de pré-visualização."
        });
        return;
    }

    setIsExporting(true);
    
    try {
        const canvas = await html2canvas(element, { 
            backgroundColor: null, // Fundo transparente
            useCORS: true,
            scale: 2 // Maior resolução
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'minha-assinatura.png';
        link.href = dataUrl;
        link.click();
        toast({
            title: "Assinatura Exportada!",
            description: "Sua assinatura foi salva como uma imagem PNG."
        });
    } catch (error) {
        console.error("Erro ao exportar assinatura:", error);
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Ocorreu um problema ao gerar a imagem da assinatura."
        });
    } finally {
        setIsExporting(false);
    }
  };

  if (!isLoaded) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-5 w-80 mx-auto mb-8" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
  }

  return (
    <main className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
                    Gerador de Assinatura
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Personalize e exporte sua assinatura para usar onde quiser.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Pré-visualização */}
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
                    <AssinaturaPreview 
                        profile={profile}
                        showPhoto={showPhoto}
                        showUsername={showUsername}
                        showSocial={showSocial}
                    />
                </div>

                {/* Controles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Opções de Visualização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="show-photo" className="flex items-center gap-2 cursor-pointer">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                Mostrar Avatar
                            </Label>
                            <Switch
                                id="show-photo"
                                checked={showPhoto}
                                onCheckedChange={setShowPhoto}
                            />
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="show-username" className="flex items-center gap-2 cursor-pointer">
                                <User className="h-5 w-5 text-muted-foreground" />
                                Mostrar Nome
                            </Label>
                            <Switch
                                id="show-username"
                                checked={showUsername}
                                onCheckedChange={setShowUsername}
                            />
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-lg border">
                            <Label htmlFor="show-social" className="flex items-center gap-2 cursor-pointer">
                                <AtSign className="h-5 w-5 text-muted-foreground" />
                                Mostrar Rede Social
                            </Label>
                            <Switch
                                id="show-social"
                                checked={showSocial}
                                onCheckedChange={setShowSocial}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center mt-10">
                <Button size="lg" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-5 w-5" />
                    )}
                    {isExporting ? "Exportando..." : "Exportar como PNG"}
                </Button>
            </div>
        </div>
    </main>
  );
}
