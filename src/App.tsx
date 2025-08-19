import './App.css';
import { Box, CardContent, Typography, CircularProgress, Avatar } from '@mui/material';
import { useLanyard } from 'react-use-lanyard';
import { DISCORD_AVATAR_URL, ACTIVITY_NAMES } from './consts.ts';
import format from 'string-template';
import { ErrorBoundary } from 'react-error-boundary';
import StyledBadge from './components/StyledBadge.tsx';
import SpringyCard from './components/SpringyCard.tsx';
import { usePrimaryActivity } from './utils/utils.ts';


function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('user_id') ?? '';
  const fallbackUrl = searchParams.get('url') || '';
  const { loading, status } = useLanyard({
    userId,
    socket: true,
  });
  const activity = usePrimaryActivity(status?.activities);
  const isStreaming = activity?.activityAction === ACTIVITY_NAMES.STREAMING;
  const url = isStreaming && activity.url ? activity.url : fallbackUrl ?? undefined;

  if (userId === '') {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';

    return <>
      <p>Need to include a user_id in the url like so:</p><br />
      <p>{url.toString()}?user_id=3474873838384874</p>
    </>;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(status);
  }

  const renderCard = (
    <SpringyCard sx={{ display: 'flex', p: '1rem', width: '400px', maxWidth: '100%', mx: 'auto' }} direction='right'>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, mr: 2 }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          size={56}
          whiteRingPx={4}
          offset={{ y: 24 }}
          indicatorShadow
          presence={isStreaming ? 'streaming' : status?.discord_status ?? 'offline'}
        >
          <Avatar
            alt={status?.discord_user.global_name || ''}
            src={format(DISCORD_AVATAR_URL, { userId, avatar: status?.discord_user.avatar })}
            sx={{
              width: '128px',
              height: '128px',
              boxShadow: '0 10px 64px rgba(0,0,0,.35)',
            }}
          />
        </StyledBadge>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', textAlign: 'left', minWidth: 0, py: 0 }}>
          <Typography component="div" variant="h5">
            {status?.discord_user.global_name || ''}
          </Typography>
          <Box display="flex" flexDirection="column" justifyContent="center" sx={{ minWidth: 0 }}>
            {activity
              ? activity.text.map((text, index) => (
                <Typography
                  key={index}
                  variant={index === 0 ? "subtitle1" : "subtitle2"}
                  component="div"
                  noWrap
                  sx={{ color: 'text.secondary', width: '100%' }}
                >
                  {text}
                </Typography>
              ))
              : <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
                Connection... untraceable
              </Typography>
            }
          </Box>
        </CardContent>
      </Box>
    </SpringyCard>
  );

  return (
    <ErrorBoundary fallback={<p>Whoops! An error occurred.</p>}>
      {loading || !status || !activity ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )
        : url
          ? <a href={url} target="_blank" rel="noopener noreferrer">{renderCard}</a>
          : <>{renderCard}</>
        }
    </ErrorBoundary>
  );
}


export default App;
