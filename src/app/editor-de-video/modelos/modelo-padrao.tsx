
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import type { EstiloTexto } from '../tipos';
import { cn } from '@/lib/utils';

interface ModeloPadraoProps extends VisualizacaoEditorProps {
    textStyle: EstiloTexto;
}


export function ModeloPadrao({
  text,
  textStyle,
  textVerticalPosition,
  showProfileSignature,
  profile,
  signaturePositionX,
  signaturePositionY,
  signatureScale,
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
  showSignatureBackground,
  signatureBgColor,
  signatureBgOpacity,
  showLogo,
  logoPositionX,
  logoPositionY,
  logoScale,
  logoOpacity,
}: ModeloPadraoProps) {

  const getJustifyClass = (align: React.CSSProperties['textAlign']) => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  return (
    <div className="relative w-full h-full p-8 flex flex-col">
      
      {/* Container de Texto Principal */}
      <div 
        className="w-full flex-grow flex"
        style={{
          alignItems: 'center', // Centraliza verticalmente no espaço disponível
          justifyContent: getJustifyClass(textStyle.textAlign),
        }}
      >
        <div
          style={textStyle}
          className="break-words"
        >
          {text}
        </div>
      </div>

      {/* Container da Assinatura */}
      {showProfileSignature && (
        <div
          className="w-full flex justify-center"
          style={{
            flexGrow: 0, // Não permite que cresça
            flexShrink: 0, // Não permite que encolha
            transform: `scale(${signatureScale / 100})`,
            transformOrigin: 'bottom center',
            paddingBottom: `${100 - signaturePositionY}%` // Usa padding para empurrar para a posição correta
          }}
        >
          <AssinaturaPerfil
            profile={profile}
            showPhoto={showSignaturePhoto}
            showUsername={showSignatureUsername}
            showSocial={showSignatureSocial}
            showBackground={showSignatureBackground}
            bgColor={signatureBgColor}
            bgOpacity={signatureBgOpacity}
          />
        </div>
      )}

      {/* Container da Logo (Posicionamento Absoluto ainda é melhor aqui) */}
      {showLogo && profile.logo && (
         <div
          className="absolute"
          style={{
            top: `${logoPositionY}%`,
            left: `${logoPositionX}%`,
            transform: `translate(-50%, -50%) scale(${logoScale / 100})`,
            opacity: logoOpacity / 100,
          }}
        >
            <img
              src={profile.logo}
              alt="Logomarca"
              className="max-w-[150px] max-h-[150px]"
            />
        </div>
      )}
    </div>
  );
}
