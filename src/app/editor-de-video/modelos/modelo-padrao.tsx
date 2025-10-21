
import type { EditorState, EstiloTexto } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import { EMOJI_REGEX } from '../utils/text-style-utils'; // Importando a REGEX

interface ModeloPadraoProps {
    editorState: EditorState;
    baseTextStyle: EstiloTexto;
    textEffectsStyle: EstiloTexto;
    profile: any;
}

export function ModeloPadrao({
    editorState,
    baseTextStyle,
    textEffectsStyle,
    profile
}: ModeloPadraoProps) {

    const { 
        text, 
        textVerticalPosition,
        applyEffectsToEmojis,
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

    // Nova função para renderizar o texto com a lógica de emoji
    const renderTextWithEmojis = () => {
        if (!text) return null;
        const parts = text.split(EMOJI_REGEX);

        return (
            <>
                {parts.map((part, index) => {
                    const isEmoji = EMOJI_REGEX.test(part);
                    if (isEmoji && !applyEffectsToEmojis) {
                        // Se for um emoji e os efeitos estiverem desativados, renderiza sem eles
                        return <span key={index} style={{ textShadow: 'none', filter: 'none' }}>{part}</span>;
                    }
                    // Caso contrário, renderiza a parte do texto (ou emoji com efeitos)
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    return (
        <div className="relative w-full h-full">
            {/* Main Text Container */}
            <div
                className="absolute w-full px-8"
                style={{
                    top: `${textVerticalPosition}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div
                    style={{ ...baseTextStyle, ...textEffectsStyle }} // Combina os estilos base com os de efeito
                    className="break-words"
                >
                    {renderTextWithEmojis()} 
                </div>
            </div>

            {/* Logo e Assinatura (código existente permanece o mesmo) */}
            {showLogo && profile.logo && (
                <div className="absolute" style={{ top: `${logoPositionY}%`, left: `${logoPositionX}%`, transform: 'translate(-50%, -50%)' }}>
                    <div style={{ transform: `scale(${logoScale / 100})`, opacity: logoOpacity / 100 }}>
                        <img src={profile.logo} alt="Logomarca" className="max-w-[150px] max-h-[150px]" />
                    </div>
                </div>
            )}
            {showProfileSignature && (
                <div className="absolute" style={{ top: `${signaturePositionY}%`, left: `${signaturePositionX}%`, transform: `translate(-50%, -50%) scale(${signatureScale / 100})`, transformOrigin: 'center center' }}>
                    <AssinaturaPerfil profile={profile} showPhoto={showSignaturePhoto} showUsername={showSignatureUsername} showSocial={showSignatureSocial} showBackground={showSignatureBackground} bgColor={signatureBgColor} bgOpacity={signatureBgOpacity} />
                </div>
            )}
        </div>
    );
}
