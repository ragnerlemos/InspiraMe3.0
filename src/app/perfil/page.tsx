
"use client";

import React, { useRef, useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Link as LinkIcon, Edit2, Upload, Twitter, Eye, EyeOff, Calendar, ImageUp, Download, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
             <div className="text-center mb-8">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-5 w-80 mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="h-[400px] w-full" />
                </div>
                 <div>
                    <Skeleton className="h-[300px] w-full" />
                </div>
            </div>
        </div>
    )
}

// Página de Perfil para o usuário editar suas informações.
export default function ProfilePage() {
  const { profile, updateProfile, isLoaded } = useProfile();
  const { toast } = useToast();
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleProfileChange = (field: keyof typeof profile, value: string | boolean) => {
    updateProfile({ [field]: value });
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Arquivo Inválido',
          description: 'Por favor, selecione um arquivo de imagem.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ [field]: reader.result as string });
         toast({
          title: `${field === 'photo' ? 'Foto' : 'Logomarca'} Atualizada!`,
          description: `Sua ${field === 'photo' ? 'foto de perfil' : 'logomarca'} foi alterada com sucesso.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('profile-preview-export');
    if (!element) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
      return;
    }

    setIsExporting(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;

      // Pegar referências dos elementos
      const avatarEl = element.querySelector('img') as HTMLImageElement | null;
      const usernameEl = element.querySelector('p.font-semibold') as HTMLElement | null;
      const socialEl = element.querySelector('p.text-muted-foreground') as HTMLElement | null;
      const quoteEl = element.querySelector('p.text-base') as HTMLElement | null;

      // Fallback de valores
      const username = usernameEl?.textContent || profile.username;
      const social = socialEl?.textContent || profile.social;
      const quote = quoteEl?.textContent || '"A única maneira de fazer um ótimo trabalho é amar o que você faz."';

      // Estilos computados
      const usernameStyle = usernameEl ? getComputedStyle(usernameEl) : { fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: '600', color: 'hsl(var(--foreground))' } as any;
      const socialStyle = socialEl ? getComputedStyle(socialEl) : { fontFamily: 'PT Sans, sans-serif', fontSize: '14px', color: 'hsl(var(--muted-foreground))' } as any;
      const quoteStyle = quoteEl ? getComputedStyle(quoteEl) : { fontFamily: 'PT Sans, sans-serif', fontSize: '16px', color: 'hsl(var(--foreground))' } as any;
      
      const cardStyle = getComputedStyle(element);

      // Dimensões
      const rect = element.getBoundingClientRect();
      const svgWidth = rect.width;
      const svgHeight = rect.height;
      const padding = 16;
      const avatarSize = 48;
      
      // Converter avatar para dataURL
      const loadImageAsDataURL = (src?: string | null) =>
        new Promise<string | null>((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            try {
              const c = document.createElement('canvas');
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              const ctx = c.getContext('2d');
              if (!ctx) return resolve(null);
              ctx.drawImage(img, 0, 0);
              resolve(c.toDataURL('image/png'));
            } catch (e) { resolve(null); }
          };
          img.onerror = () => resolve(null);
          img.src = src;
        });

      const avatarDataUrl = await loadImageAsDataURL(avatarEl?.src || profile.photo);

      // Escapar texto para SVG
      const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      const wrapText = (text: string, maxWidth: number, fontSize: number, fontFamily: string) => {
          const words = text.split(' ');
          const lines = [];
          let currentLine = words[0];
          const tempSpan = document.createElement("span");
          tempSpan.style.fontFamily = fontFamily;
          tempSpan.style.fontSize = fontSize + 'px';
          tempSpan.style.visibility = 'hidden';
          document.body.appendChild(tempSpan);

          for (let i = 1; i < words.length; i++) {
              const word = words[i];
              tempSpan.textContent = currentLine + " " + word;
              if (tempSpan.getBoundingClientRect().width > maxWidth) {
                  lines.push(currentLine);
                  currentLine = word;
              } else {
                  currentLine += " " + word;
              }
          }
          lines.push(currentLine);
          document.body.removeChild(tempSpan);
          return lines;
      }
      
      const quoteFontSize = parseFloat(quoteStyle.fontSize || '16');
      const wrappedQuote = wrapText(quote, svgWidth - padding * 2 - 20, quoteFontSize, quoteStyle.fontFamily);


      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <defs>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=PT+Sans:wght@400&display=swap');
                  .card-bg { fill: ${cardStyle.backgroundColor}; }
                  .username { font-family: ${usernameStyle.fontFamily}; font-size: ${usernameStyle.fontSize}; font-weight: ${usernameStyle.fontWeight}; fill: ${usernameStyle.color}; }
                  .social { font-family: ${socialStyle.fontFamily}; font-size: ${socialStyle.fontSize}; fill: ${socialStyle.color}; }
                  .quote { font-family: ${quoteStyle.fontFamily}; font-size: ${quoteStyle.fontSize}; fill: ${quoteStyle.color}; }
              </style>
          </defs>

          <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" rx="${parseFloat(cardStyle.borderRadius || '8')}" class="card-bg" />
          
          <g transform="translate(${padding}, ${padding})">
              ${avatarDataUrl ? `<image href="${avatarDataUrl}" x="0" y="0" width="${avatarSize}" height="${avatarSize}" clip-path="circle(${avatarSize/2}px at ${avatarSize/2}px ${avatarSize/2}px)" />` : `<circle cx="${avatarSize/2}" cy="${avatarSize/2}" r="${avatarSize/2}" fill="#ccc"/>`}
              
              <text x="${avatarSize + 12}" y="${avatarSize / 2 - 4}" class="username">${esc(username)}</text>
              <text x="${avatarSize + 12}" y="${avatarSize / 2 + 14}" class="social">${esc(social)}</text>

              <g transform="translate(0, ${avatarSize + 24})">
                  ${wrappedQuote.map((line, i) => `<text x="0" y="${i * quoteFontSize * 1.5}" class="quote">${esc(line)}</text>`).join('')}
              </g>
          </g>
        </svg>
      `;

      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = svgWidth * 2;
          canvas.height = svgHeight * 2;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Contexto do canvas indisponível.');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          
          const link = document.createElement('a');
          link.download = `meu-perfil-inspireme.png`;
          link.href = dataUrl;
          link.click();
          
          URL.revokeObjectURL(url);
          toast({ title: 'Sucesso!', description: 'A imagem do perfil foi salva.' });
        } catch(e) {
             toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Falha ao converter SVG para PNG.' });
        } finally {
            setIsExporting(false);
        }
      };
      img.onerror = () => {
          URL.revokeObjectURL(url);
          setIsExporting(false);
          toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Falha ao carregar a imagem SVG gerada.' });
      }
      img.src = url;

    } catch (error) {
      console.error("Erro ao exportar perfil:", error);
      toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Ocorreu um problema ao gerar a imagem.' });
      setIsExporting(false);
    }
  };


  if (!isLoaded) {
      return <ProfileSkeleton />;
  }

  return (
    <main className="h-full overflow-y-auto">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Meu Perfil
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
              Personalize como você aparece no aplicativo.
              </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Coluna de Edição */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Edit2 /> Editar Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2"><User />Nome de Usuário</Label>
                      <Input
                          id="username"
                          value={profile.username}
                          onChange={(e) => handleProfileChange('username', e.target.value)}
                          placeholder="Seu nome..."
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="social" className="flex items-center gap-2"><LinkIcon />Rede Social</Label>
                      <Input
                          id="social"
                          value={profile.social}
                          onChange={(e) => handleProfileChange('social', e.target.value)}
                          placeholder="@seuusuario..."
                      />
                  </div>
                   <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Upload />Foto de Perfil</Label>
                      <input
                          type="file"
                          ref={photoFileInputRef}
                          onChange={(e) => handleFileUpload(e, 'photo')}
                          className="hidden"
                          accept="image/*"
                      />
                      <Button onClick={() => photoFileInputRef.current?.click()} variant="outline" className="w-full">
                          Carregar Nova Foto
                      </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                      <Label className="flex items-center gap-2"><ImageUp />Logomarca</Label>
                       <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                          accept="image/*"
                      />
                       <Button onClick={() => logoFileInputRef.current?.click()} variant="outline" className="w-full">
                          Carregar Logomarca
                      </Button>
                      <div className="relative">
                        <Input
                            id="logo-url"
                            value={profile.logo || ''}
                            onChange={(e) => handleProfileChange('logo', e.target.value)}
                            placeholder="Ou cole o link da imagem aqui"
                        />
                      </div>
                       <p className="text-xs text-muted-foreground text-center pt-1">
                          Use uma imagem com fundo transparente (PNG) para melhores resultados.
                      </p>
                  </div>
              </CardContent>
          </Card>
          
          {/* Coluna de Pré-visualização */}
          <div>
              <h3 className="text-xl font-headline mb-4 text-center">Pré-visualização</h3>
              <Card className="max-w-sm mx-auto overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="bg-muted h-24 relative flex items-center justify-center">
                    {profile.logo && (
                        <img src={profile.logo} alt="Pré-visualização da logomarca" className="max-h-full max-w-full p-2" />
                    )}
                  </div>
                  <CardContent className="relative text-center -mt-14 pt-0">
                      <Avatar className="w-24 h-24 mx-auto border-4 border-card shadow-lg">
                          <AvatarImage src={profile.photo || ''} alt={profile.username} />
                          <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      <h2 className="text-2xl font-bold mt-4 font-headline">{profile.username}</h2>
                      <p className="text-muted-foreground">{profile.social}</p>

                      <div className="mt-6 border-t pt-4">
                          <Card id="profile-preview-export" className="text-left">
                              <CardHeader className="p-4">
                                  <div className="flex items-start gap-3">
                                      <Avatar>
                                          <AvatarImage src={profile.photo || ''} alt={profile.username} />
                                          <AvatarFallback><User /></AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                              <div>
                                                  <p className="font-semibold">{profile.username}</p>
                                                  <p className="text-sm text-muted-foreground">{profile.social}</p>
                                              </div>
                                               <Button variant="ghost" size="icon" onClick={() => handleProfileChange('showIcon', !profile.showIcon)}>
                                                  {profile.showIcon ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                               </Button>
                                          </div>
                                      </div>
                                  </div>
                                  <p className="mt-3 text-base">"A única maneira de fazer um ótimo trabalho é amar o que você faz."</p>
                              </CardHeader>
                               <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                                    {profile.showDate ? (
                                          <p>10:30 AM · 28 de Maio de 2024</p>
                                    ) : <div />}
                                    <Button variant="ghost" size="icon" onClick={() => handleProfileChange('showDate', !profile.showDate)}>
                                        <Calendar className="h-5 w-5" />
                                    </Button>
                               </CardFooter>
                          </Card>
                      </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleExport} disabled={isExporting} className="w-full">
                        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isExporting ? 'Exportando...' : 'Exportar como PNG'}
                    </Button>
                  </CardFooter>
              </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

    