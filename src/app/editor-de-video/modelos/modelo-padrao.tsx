
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import TextareaAutosize from 'react-textarea-autosize';

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
            <TextareaAutosize
              readOnly
              value={text}
              style={textStyle}
              className="w-full bg-transparent border-none resize-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 m-0 overflow-hidden"
            />
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
