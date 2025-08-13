import { Card, type CardProps } from '@mui/material';
import { keyframes } from '@emotion/react';

type Direction = 'left' | 'right';

export interface SpringyCardProps extends CardProps {
  direction?: Direction;
  durationMs?: number;
  delayMs?: number;
}

/**
 * SpringyCard animates in with an elastic slide from the given direction.
 * - direction: 'left' | 'right' (default: 'right')
 * - durationMs: animation duration (default: 700)
 * - delayMs: animation delay (default: 0)
 */
export default function SpringyCard(props: SpringyCardProps) {
  const {
          direction = 'right',
          durationMs = 700,
          delayMs = 0,
          sx,
          children,
          ...rest
        } = props;

  const sign = direction === 'right' ? 1 : -1;
  const elasticSlideIn = keyframes`
    0% {
      transform: translateX(${120 * sign}%);
      opacity: 0;
    }
    60% {
      transform: translateX(${(-15) * sign}px);
      opacity: 1;
    }
    75% {
      transform: translateX(${8 * sign}px);
    }
    90% {
      transform: translateX(${(-3) * sign}px);
    }
    100% {
      transform: translateX(0);
    }
  `;

  const baseSx = {
    willChange: 'transform',
    animation: `${elasticSlideIn} ${durationMs}ms ease-out ${delayMs}ms both`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: 'none',
    },
  } as const;

  return (
    <Card
      sx={[baseSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    >
      {children}
    </Card>
  );
}
