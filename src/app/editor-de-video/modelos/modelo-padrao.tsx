
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';

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
}: VisualizacaoEditorProps) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full">
            <div
                style={{
                ...textStyle,
                // A posição vertical é controlada pelo layout flex do pai
                }}
                className="break-words w-full"
            >
                {text}
            </div>
        </div>
      </div>
      
      {showProfileSignature && (
        <div
          id="editor-signature-wrapper"
          className="absolute"
          style={{
            top: `${signaturePositionY}%`,
            left: `${signaturePositionX}%`,
            transform: `translate(-50%, -50%) scale(${signatureScale / 100})`,
            transformOrigin: 'center center',
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
            scale={signatureScale}
          />
        </div>
      )}
      {showLogo && profile.logo && (
        <div
          id="editor-logo-wrapper"
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
    </>
  );
}
