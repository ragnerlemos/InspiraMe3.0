
import type { EditorState, EstiloTexto } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import { EMOJI_REGEX } from '../utils/text-style-utils';

interface ModeloPadraoProps {
    editorState: EditorState;
    baseTextStyle: EstiloTexto;
    textEffectsStyle: EstiloTexto;
    dropShadowStyle: EstiloTexto;
    profile: any;
}

export function ModeloPadrao({
    editorState,
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
    profile
}: ModeloPadraoProps) {
    const {
        text,
        textColor,
        textVerticalPosition,
        applyEffectsToEmojis,
        applyTextColorToSignature,
        showProfileSignature,
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
    } = editorState;

    const renderTextWithEmojis = () => {
        if (!text) return null;
        const parts = text.split(EMOJI_REGEX);

        return (
            <>
                {parts.map((part, index) => {
                    const isEmoji = EMOJI_REGEX.test(part);
                    if (isEmoji && !applyEffectsToEmojis) {
                        return <span key={index} style={{ textShadow: 'none', filter: 'none' }}>{part}</span>;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    const combinedTextStyle: EstiloTexto = {
      ...baseTextStyle,
      ...textEffectsStyle,
    };
    
    return (
        <div className="relative w-full h-full overflow-hidden">
            <div
                className="absolute w-full px-8 break-words"
                style={{
                    top: `${textVerticalPosition}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    ...dropShadowStyle,
                }}
            >
                <div
                    style={combinedTextStyle}
                    className="relative"
                >
                    {renderTextWithEmojis()}
                </div>
            </div>

            {showLogo && profile.logo && (
                <div className="absolute" style={{ zIndex: 2, top: `${logoPositionY}%`, left: `${logoPositionX}%`, transform: 'translate(-50%, -50%)' }}>
                    <div style={{ transform: `scale(${logoScale / 100})`, opacity: logoOpacity / 100 }}>
                        <img src={profile.logo} alt="Logomarca" className="max-w-[150px] max-h-[150px]" />
                    </div>
                </div>
            )}
            {showProfileSignature && (
                <div className="absolute" style={{ zIndex: 2, top: `${signaturePositionY}%`, left: `${signaturePositionX}%`, transform: `translate(-50%, -50%) scale(${signatureScale / 100})`, transformOrigin: 'center center' }}>
                    <AssinaturaPerfil 
                        profile={profile} 
                        showPhoto={showSignaturePhoto} 
                        showUsername={showSignatureUsername} 
                        showSocial={showSignatureSocial} 
                        showBackground={showSignatureBackground} 
                        bgColor={signatureBgColor} 
                        bgOpacity={signatureBgOpacity}
                        textColor={applyTextColorToSignature ? textColor : '#FFFFFF'}
                    />
                </div>
            )}
        </div>
    );
}
