
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
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-full">
          <div
            style={{
              ...textStyle,
              top: `${textVerticalPosition}%`,
              transform: 'translateY(-50%)',
            }}
            className="break-words w-full absolute transition-all duration-200"
          >
            {text}
          </div>
        </div>
      </div>
      {showProfileSignature && (
        <div
          className="absolute"
          style={{
            top: `${signaturePositionY}%`,
            left: `${signaturePositionX}%`,
            transform: `translate(-50%, -50%)`, // A escala agora é tratada dentro do componente
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
