
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
      {/* Container do Texto */}
      <div className="flex items-center justify-center text-center">
        <div
          style={{
            ...textStyle,
          }}
          className="break-words w-full"
        >
          {text}
        </div>
      </div>

      {/* Container da Assinatura e Logo */}
      <div className="relative">
        {showProfileSignature && (
            <div
              className="absolute"
              style={{
                left: `${signaturePositionX}%`,
                bottom: '0px',
                transform: `translateX(-50%)`,
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
              className="absolute"
              style={{
                left: `${logoPositionX}%`,
                top: `${logoPositionY}%`, 
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
    </>
  );
}
