
"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Link as LinkIcon, Edit2, Upload, Twitter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ username: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ social: e.target.value });
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        updateProfile({ photo: reader.result as string });
         toast({
          title: 'Foto Atualizada!',
          description: 'Sua foto de perfil foi alterada com sucesso.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded) {
      return <ProfileSkeleton />;
  }

  return (
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
                        onChange={handleUsernameChange}
                        placeholder="Seu nome..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="social" className="flex items-center gap-2"><LinkIcon />Rede Social</Label>
                    <Input
                        id="social"
                        value={profile.social}
                        onChange={handleSocialChange}
                        placeholder="@seuusuario..."
                    />
                </div>
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Upload />Foto de Perfil</Label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button onClick={handlePhotoUpload} variant="outline" className="w-full">
                        Carregar Nova Foto
                    </Button>
                     <p className="text-xs text-muted-foreground text-center pt-1">
                        Recomendado: imagem quadrada (1:1).
                    </p>
                </div>
            </CardContent>
        </Card>
        
        {/* Coluna de Pré-visualização */}
        <div>
            <h3 className="text-xl font-headline mb-4 text-center">Pré-visualização</h3>
            <Card className="max-w-sm mx-auto overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-muted h-24" />
                <CardContent className="relative text-center -mt-14 pt-0">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-card shadow-lg">
                        <AvatarImage src={profile.photo || ''} alt={profile.username} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold mt-4 font-headline">{profile.username}</h2>
                    <p className="text-muted-foreground">{profile.social}</p>

                    <div className="mt-6 border-t pt-4">
                        <Card className="text-left">
                            <CardHeader className="flex flex-row items-start gap-4 p-4">
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
                                         <Twitter className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <p className="mt-3 text-base">"A única maneira de fazer um ótimo trabalho é amar o que você faz."</p>
                                </div>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                                <p>10:30 AM · 28 de Maio de 2024</p>
                            </CardFooter>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
