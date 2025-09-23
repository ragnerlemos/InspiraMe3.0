
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import type { EstiloTexto } from '../tipos';

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
  return (
    <div className="relative w-full h-full">
      {/* Main Text Container */}
      <div
        className="absolute w-full px-8"
        style={{
          top: `${textVerticalPosition}%`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          ...textStyle,
        }}
      >
        <div
            style={textStyle}
            className="break-words"
        >
            {text}
        </div>
      </div>
      
      {/* Logo Container */}
      {showLogo && profile.logo && (
        <div
          className="absolute"
          style={{
            top: `${logoPositionY}%`,
            left: `${logoPositionX}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              transform: `scale(${logoScale / 100})`,
              opacity: logoOpacity / 100,
            }}
          >
            <img
              src={profile.logo}
              alt="Logomarca"
              className="max-w-[150px] max-h-[150px]"
            />
          </div>
        </div>
      )}
      
      {/* Signature Container */}
      {showProfileSignature && (
        <div
          className="absolute"
          style={{
            top: `${signaturePositionY}%`,
            left: `${signaturePositionX}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              transform: `scale(${signatureScale / 100})`,
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
        </div>
      )}
    </div>
  );
}
