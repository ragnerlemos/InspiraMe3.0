
"use client";

import { useState } from 'react';
import { Wand2, Ratio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Tipos de proporção e seus valores correspondentes
const aspectRatios = [
  { label: '16:9', value: '16 / 9' },
  { label: '1:1', value: '1 / 1' },
  { label: '4:3', value: '4 / 3' },
  { label: '3:2', value: '3 / 2' },
  { label: '9:16', value: '9 / 16' },
  { label: '21:9', value: '21 / 9' },
];

export default function AspectWeaverPage() {
  // Estados para controlar a proporção e as cores
  const [aspectRatio, setAspectRatio] = useState('16 / 9');
  const [bgColor, setBgColor] = useState('#333333');
  const [fgColor, setFgColor] = useState('#ffffff');

  // Componente da barra lateral para desktop
  const Controls = () => (
    <div className="flex flex-col gap-6 p-4 overflow-auto">
      <div>
        <h2 className="text-lg font.semibold tracking-tight mb-3">Aspect Ratio</h2>
        <div className="grid grid-cols-2 gap-2">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
              variant={aspectRatio === ratio.value ? 'default' : 'outline'}
              className="transition-all"
            >
              {ratio.label}
            </Button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h2 className="text-lg font.semibold tracking-tight mb-3">Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="bg-color">Background</Label>
            <div className="relative">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-transparent p-0"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fg-color">Foreground</Label>
            <div className="relative">
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-transparent p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col">
      {/* Layout para telas médias e maiores (desktop) */}
      <div className="hidden md:grid md:grid-cols-[288px_1fr] flex-1">
        <aside className="border-r flex flex-col bg-card">
          <div className="flex items-center gap-2 border-b p-4 h-16 flex-shrink-0">
            <Wand2 className="h-6 w-6" />
            <h1 className="text-xl font-bold tracking-tight">Aspect Weaver</h1>
          </div>
          <Controls />
        </aside>
        <main className="w-full h-full p-4 flex items-center justify-center overflow-auto">
          <div
            className="relative w-full h-full max-w-full max-h-full transition-all duration-300 ease-in-out shadow-2xl rounded-xl"
            style={{
              aspectRatio: aspectRatio,
              backgroundColor: bgColor,
            }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
              style={{ color: fgColor }}
            >
              <Ratio className="h-16 w-16" />
              <p className="text-3xl font-bold font-mono tracking-tighter">
                {aspectRatio.replace(' / ', ':')}
              </p>
              <p className="text-muted-foreground" style={{ color: fgColor, opacity: 0.7 }}>
                Your content here
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Layout para telas pequenas (mobile) */}
      <div className="md:hidden flex flex-col flex-1">
        <header className="flex items-center gap-2 border-b p-4 flex-shrink-0 bg-background z-10 h-16">
          <Wand2 className="h-5 w-5" />
          <h1 className="text-lg font-bold tracking-tight">Aspect Weaver</h1>
        </header>
        <main className="flex-1 w-full p-4 flex items-center justify-center overflow-auto">
          <div
            className="relative w-full h-full max-w-full max-h-full transition-all duration-300 ease-in-out shadow-2xl rounded-xl"
            style={{
              aspectRatio: aspectRatio,
              backgroundColor: bgColor,
            }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
              style={{ color: fgColor }}
            >
              <Ratio className="h-8 w-8" />
              <p className="text-xl font-bold font-mono tracking-tighter">
                {aspectRatio.replace(' / ', ':')}
              </p>
              <p className="text-xs text-muted-foreground" style={{ color: fgColor, opacity: 0.7 }}>
                Your content here
              </p>
            </div>
          </div>
        </main>
        <footer className="border-t p-2 flex-shrink-0 bg-background z-10">
           <div className="flex justify-around items-center h-14">
             <div className="flex items-center gap-1 overflow-x-auto pr-2">
                {aspectRatios.map((ratio) => (
                  <Button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    variant={aspectRatio === ratio.value ? 'default' : 'outline'}
                    size="sm"
                  >
                    {ratio.label}
                  </Button>
                ))}
             </div>
             <div className="flex items-center gap-2 pl-2 border-l">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8" />
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8" />
             </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
