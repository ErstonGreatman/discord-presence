import Badge, { type BadgeProps } from '@mui/material/Badge';
import { styled, keyframes } from '@mui/material/styles';

export type Presence = 'online' | 'idle' | 'dnd' | 'offline' | 'streaming';

export interface StyledPresenceBadgeProps extends Omit<BadgeProps, 'variant' | 'badgeContent'> {
  presence: Presence;
  size?: number;           // default 32
  ripple?: boolean;        // default: true except offline
  offset?: number | { x?: number; y?: number }; // inward from bottom-right
  backplate?: boolean;     // show dark backplate (default true)
  whiteRingPx?: number;    // extra white ring around the shape (default 0 = none)
  indicatorShadow?: boolean | string; // drop shadow around status (default true)
}

const rippleKeyframes = keyframes`
  0%   { transform: scale(0.85); opacity: 0.45; }
  70%  { transform: scale(1.7);  opacity: 0.18; }
  100% { transform: scale(1.95); opacity: 0;    }
`;

const Root = styled(Badge, {
  shouldForwardProp: (prop) =>
                       prop !== 'presence' &&
                       prop !== 'size' &&
                       prop !== 'ripple' &&
                       prop !== 'offset' &&
                       prop !== 'backplate' &&
                       prop !== 'whiteRingPx' &&
                       prop !== 'indicatorShadow',
})<StyledPresenceBadgeProps>(({ theme, presence, size = 32, ripple, offset, backplate = true, whiteRingPx = 0, indicatorShadow = true }) => {
  const colors = {
    online: '#23A55A',
    idle: '#F0B232',
    dnd: '#F23F43',
    offline: '#80848E',
    streaming: '#593695',
    bg: theme.palette.common.white,
    bar: '#2B2D31',
    backplate: 'rgba(0,0,0,0.55)',
  };

  const offX = typeof offset === 'number' ? offset : offset?.x ?? 6; // left
  const offY = typeof offset === 'number' ? offset : offset?.y ?? 6; // up

  // Use a small gap only if backplate is visible; otherwise no gap so the white ring sits flush
  const bgGap = backplate ? Math.max(2, Math.round(size * 0.06)) : 0;
  const inset = Math.max(4, Math.round(size * 0.18));
  const barH = Math.max(4, Math.round(size * 0.18));
  const ringW = Math.max(3, Math.round(size * 0.12));

  const rippleColor =
          presence === 'online' ? colors.online
            : presence === 'idle' ? colors.idle
              : presence === 'dnd' ? colors.dnd
                : presence === 'streaming' ? colors.streaming
                  : colors.offline;

  const ringShadow = whiteRingPx > 0 ? `0 0 0 ${whiteRingPx}px ${colors.bg}` : '';
  const depthShadow =
          indicatorShadow
            ? typeof indicatorShadow === 'string'
              ? indicatorShadow
              : '0 6px 14px rgba(0,0,0,.35)'
            : '';
  const combinedShadow = [ringShadow, depthShadow].filter(Boolean).join(', ');

  return {
    '& .MuiBadge-badge': {
      width: size,
      height: size,
      minWidth: size,
      padding: 0,
      borderRadius: '50%',
      background: 'transparent',
      right: offX,
      bottom: offY,
      zIndex: 1,
    },

    '& .status': {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
    },

    // optional dark backplate for contrast
    '& .backplate': {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      backgroundColor: colors.backplate,
      zIndex: 0,
      display: backplate ? 'block' : 'none',
      // add a subtle soft edge to the backplate too
      boxShadow: backplate ? '0 2px 8px rgba(0,0,0,.35)' : 'none',
    },

    // ripple ring stays inside the badge
    '& .ripple': {
      position: 'absolute',
      inset: `${bgGap}px`,
      borderRadius: '50%',
      border: `2px solid ${rippleColor}`,
      animation: ripple ? `${rippleKeyframes} 1.4s ease-out infinite` : 'none',
      pointerEvents: 'none',
      zIndex: 1,
      ...(presence === 'offline' ? { display: 'none' } : null),
    },

    // foreground disk (with optional white ring and shadow)
    '& .shape': {
      position: 'absolute',
      inset: `${bgGap}px`,
      borderRadius: '50%',
      backgroundColor:
        presence === 'idle' || presence === 'offline'
                  ? colors.bg
                  : presence === 'online'
            ? colors.online
            : presence === 'dnd'
              ? colors.dnd
              : presence === 'streaming'
                ? colors.streaming
                : colors.bg,
      zIndex: 2,
      boxSizing: 'border-box',
      boxShadow: combinedShadow || 'none',
    },

    // dnd bar
    ...(presence === 'dnd'
      ? {
        '& .shape::after': {
          content: '""',
          position: 'absolute',
          left: inset,
          right: inset,
          top: `calc(50% - ${barH / 2}px)`,
          height: `${barH}px`,
          borderRadius: `${barH / 2}px`,
          backgroundColor: colors.bar,
        },
      }
      : null),

    // idle crescent
    ...(presence === 'idle'
      ? {
        '& .shape::before': {
          content: '""',
          position: 'absolute',
          inset: `${inset}px`,
          borderRadius: '50%',
          backgroundColor: colors.idle,
        },
        '& .shape::after': {
          content: '""',
          position: 'absolute',
          top: `${inset}px`,
          right: `${inset}px`,
          width: `${size - bgGap * 2 - inset * 2 - Math.round(size * 0.28)}px`,
          height: `${size - bgGap * 2 - inset * 2 - Math.round(size * 0.28)}px`,
          borderRadius: '50%',
          backgroundColor: colors.bg,
        },
      }
      : null),

    // offline hollow ring
    ...(presence === 'offline'
      ? {
        '& .shape': {
          border: `${ringW}px solid ${colors.offline}`,
        },
      }
      : null),

    // streaming play triangle
    ...(presence === 'streaming'
      ? {
        '& .shape::after': {
          content: '""',
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transform: 'translate(-38%, -50%)',
          borderStyle: 'solid',
          borderWidth: `${Math.round((size - bgGap * 2) * 0.22)}px 0 ${Math.round(
            (size - bgGap * 2) * 0.22
          )}px ${Math.round((size - bgGap * 2) * 0.30)}px`,
          borderColor: `transparent transparent transparent ${colors.bg}`,
        },
      }
      : null),
  };
});

export default function StyledBadge({
                                      presence,
                                      size = 32,
                                      ripple: rippleProp,
                                      offset,
                                      backplate,
                                      whiteRingPx,
                                      indicatorShadow,
                                      children,
                                      ...rest
                                    }: StyledPresenceBadgeProps) {
  const ripple = rippleProp ?? presence !== 'offline';

  const badgeContent = (
    <span className="status" aria-hidden>
      <span className="backplate" />
      <span className="ripple" />
      <span className="shape" />
    </span>
  );

  return (
    <Root
      presence={presence}
      size={size}
      ripple={ripple}
      offset={offset}
      backplate={backplate}
      whiteRingPx={whiteRingPx}
      indicatorShadow={indicatorShadow}
      badgeContent={badgeContent}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      {...rest}
    >
      {children}
    </Root>
  );
}
