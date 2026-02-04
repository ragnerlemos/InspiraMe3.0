
import React from 'react';
import type { EditorState, EstiloTexto } from '@/app/editor-de-video/tipos';
import type { ProfileData } from '@/hooks/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Twitter } from 'lucide-react';

interface ModeloTwitterProps {
  editorState: EditorState;
  profile: ProfileData;
  baseTextStyle: React.CSSProperties;
  textEffectsStyle: React.CSSProperties;
  dropShadowStyle: React.CSSProperties;
}

// Este é um componente de placeholder para o modelo estilo Twitter.
// Ele será usado no gerador de memes.
export function ModeloTwitter({
  editorState,
  profile,
  baseTextStyle,
}: ModeloTwitterProps) {
  return (
    <div className="w-full h-full bg-black p-8 flex flex-col justify-center text-white">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profile.photo ?? undefined} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{profile.username}</p>
              <p className="text-sm text-gray-400">{profile.social}</p>
            </div>
            <Twitter className="h-6 w-6 text-[#1DA1F2]" />
          </div>
          <p className="mt-4 text-2xl whitespace-pre-wrap" style={baseTextStyle}>
            {editorState.text}
          </p>
        </div>
      </div>
    </div>
  );
}
