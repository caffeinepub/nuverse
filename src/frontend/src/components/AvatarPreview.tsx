import { AvatarConfig, SKIN_TONES } from '../types/avatar';
import { EquippedLook } from '../types/avatarCloset';
import { getItemById } from '../mock/avatarClosetPlaceholders';

interface AvatarPreviewProps {
  config: AvatarConfig;
  equippedLook?: EquippedLook;
}

export default function AvatarPreview({ config, equippedLook }: AvatarPreviewProps) {
  const skinColor = SKIN_TONES.find(t => t.value === config.skinTone)?.color || '#F1C27D';

  // Get equipped items
  const equippedShoes = equippedLook?.shoes ? getItemById(equippedLook.shoes) : undefined;
  const equippedAccessories = equippedLook?.accessories ? getItemById(equippedLook.accessories) : undefined;
  const equippedOutfit = equippedLook?.outfits ? getItemById(equippedLook.outfits) : undefined;

  // Simple SVG-based avatar preview
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 200 280"
        className="h-full w-full max-w-[280px]"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Body */}
        <g id="body">
          {config.bodyType === 'slim' && (
            <rect x="70" y="140" width="60" height="120" rx="8" fill={skinColor} opacity="0.9" />
          )}
          {config.bodyType === 'athletic' && (
            <rect x="65" y="140" width="70" height="120" rx="8" fill={skinColor} opacity="0.9" />
          )}
          {config.bodyType === 'average' && (
            <rect x="60" y="140" width="80" height="120" rx="8" fill={skinColor} opacity="0.9" />
          )}
          {config.bodyType === 'muscular' && (
            <rect x="55" y="140" width="90" height="120" rx="8" fill={skinColor} opacity="0.9" />
          )}
          {config.bodyType === 'plus' && (
            <rect x="50" y="140" width="100" height="120" rx="12" fill={skinColor} opacity="0.9" />
          )}
        </g>

        {/* Outfit overlay (if equipped) */}
        {equippedOutfit && (
          <g id="outfit-overlay">
            {config.bodyType === 'slim' && (
              <rect x="68" y="138" width="64" height="124" rx="10" fill={equippedOutfit.color} opacity="0.7" />
            )}
            {config.bodyType === 'athletic' && (
              <rect x="63" y="138" width="74" height="124" rx="10" fill={equippedOutfit.color} opacity="0.7" />
            )}
            {config.bodyType === 'average' && (
              <rect x="58" y="138" width="84" height="124" rx="10" fill={equippedOutfit.color} opacity="0.7" />
            )}
            {config.bodyType === 'muscular' && (
              <rect x="53" y="138" width="94" height="124" rx="10" fill={equippedOutfit.color} opacity="0.7" />
            )}
            {config.bodyType === 'plus' && (
              <rect x="48" y="138" width="104" height="124" rx="14" fill={equippedOutfit.color} opacity="0.7" />
            )}
          </g>
        )}

        {/* Head */}
        <g id="head">
          {config.face === 'round' && (
            <circle cx="100" cy="80" r="50" fill={skinColor} />
          )}
          {config.face === 'oval' && (
            <ellipse cx="100" cy="80" rx="45" ry="55" fill={skinColor} />
          )}
          {config.face === 'square' && (
            <rect x="55" y="30" width="90" height="100" rx="8" fill={skinColor} />
          )}
          {config.face === 'heart' && (
            <path
              d="M 100 30 Q 140 30 145 60 Q 145 90 100 130 Q 55 90 55 60 Q 60 30 100 30 Z"
              fill={skinColor}
            />
          )}
          {config.face === 'diamond' && (
            <path
              d="M 100 30 L 140 80 L 100 130 L 60 80 Z"
              fill={skinColor}
            />
          )}
        </g>

        {/* Hair */}
        <g id="hair">
          {config.hair === 'short' && (
            <ellipse cx="100" cy="50" rx="52" ry="30" fill="#2C1810" />
          )}
          {config.hair === 'medium' && (
            <>
              <ellipse cx="100" cy="50" rx="52" ry="30" fill="#2C1810" />
              <rect x="50" y="60" width="100" height="40" fill="#2C1810" opacity="0.8" />
            </>
          )}
          {config.hair === 'long' && (
            <>
              <ellipse cx="100" cy="50" rx="52" ry="30" fill="#2C1810" />
              <rect x="50" y="60" width="100" height="80" fill="#2C1810" opacity="0.8" />
            </>
          )}
          {config.hair === 'curly' && (
            <>
              <circle cx="80" cy="45" r="18" fill="#2C1810" />
              <circle cx="100" cy="40" r="20" fill="#2C1810" />
              <circle cx="120" cy="45" r="18" fill="#2C1810" />
              <circle cx="90" cy="55" r="16" fill="#2C1810" />
              <circle cx="110" cy="55" r="16" fill="#2C1810" />
            </>
          )}
          {config.hair === 'braids' && (
            <>
              <ellipse cx="100" cy="50" rx="52" ry="30" fill="#2C1810" />
              <line x1="70" y1="60" x2="65" y2="120" stroke="#2C1810" strokeWidth="6" />
              <line x1="85" y1="60" x2="80" y2="120" stroke="#2C1810" strokeWidth="6" />
              <line x1="100" y1="60" x2="100" y2="120" stroke="#2C1810" strokeWidth="6" />
              <line x1="115" y1="60" x2="120" y2="120" stroke="#2C1810" strokeWidth="6" />
              <line x1="130" y1="60" x2="135" y2="120" stroke="#2C1810" strokeWidth="6" />
            </>
          )}
        </g>

        {/* Accessories overlay (if equipped) */}
        {equippedAccessories && (
          <g id="accessories-overlay">
            {/* Simple accessory indicator on head/face area */}
            <circle
              cx="130"
              cy="70"
              r="12"
              fill={equippedAccessories.color}
              opacity="0.8"
              style={{ filter: `drop-shadow(0 0 8px ${equippedAccessories.color})` }}
            />
          </g>
        )}

        {/* Face features */}
        <g id="face-features">
          {/* Eyes */}
          <circle cx="80" cy="75" r="5" fill="#1a1a1a" />
          <circle cx="120" cy="75" r="5" fill="#1a1a1a" />
          {/* Nose */}
          <line x1="100" y1="85" x2="100" y2="95" stroke="#1a1a1a" strokeWidth="2" opacity="0.3" />
          {/* Mouth */}
          <path d="M 85 105 Q 100 110 115 105" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.5" />
        </g>

        {/* Shoes overlay (if equipped) */}
        {equippedShoes && (
          <g id="shoes-overlay">
            {/* Simple shoe indicators at bottom */}
            <ellipse
              cx="80"
              cy="265"
              rx="18"
              ry="10"
              fill={equippedShoes.color}
              opacity="0.9"
              style={{ filter: `drop-shadow(0 2px 8px ${equippedShoes.color})` }}
            />
            <ellipse
              cx="120"
              cy="265"
              rx="18"
              ry="10"
              fill={equippedShoes.color}
              opacity="0.9"
              style={{ filter: `drop-shadow(0 2px 8px ${equippedShoes.color})` }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
