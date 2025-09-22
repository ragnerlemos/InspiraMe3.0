
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import type { EstiloTexto } from '../tipos';

interface ModeloPadraoProps extends VisualizacaoEditorProps {
    textStyle: EstiloTexto;
}

export function ModeloPadrao({
  text,
  textStyle,
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
  
  const textSpacer = Math.max(0, signaturePositionY - 50 - 25);
  const logoSpacer = Math.max(0, 50 - logoPositionY - 25);


  return (
    <div className="relative w-full h-full flex flex-col p-8">
      
        {/* Spacer to push logo down */}
        <div style={{ flexGrow: logoPositionY > 50 ? logoSpacer : logoPositionY - 5 }}></div>

        {/* Logo Container */}
        {showLogo && profile.logo && (
            <div className="flex justify-center" style={{ flexGrow: 0 }}>
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

        {/* Spacer between logo and text */}
        <div style={{ flexGrow: 10 }}></div>
      
        {/* Main Text Container */}
        <div className="flex-grow flex items-center justify-center">
            <div
                style={textStyle}
                className="break-words"
            >
                {text}
            </div>
        </div>

        {/* Spacer to push signature down */}
        <div style={{ flexGrow: textSpacer }}></div>
      
        {/* Signature Container */}
        {showProfileSignature && (
            <div className="flex justify-center" style={{ flexGrow: 0 }}>
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

        {/* Bottom spacer */}
        <div style={{ flexGrow: 100 - signaturePositionY }}></div>
    </div>
  );
}
