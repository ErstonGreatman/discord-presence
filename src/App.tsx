import './App.css';
import { Box, CardContent, Typography, CircularProgress, Avatar } from '@mui/material';
import { useLanyard } from 'react-use-lanyard';
import { getActivityType } from './utils/utils.ts';
import { DISCORD_AVATAR_URL } from './consts.ts';
import format from 'string-template';
import { ErrorBoundary } from 'react-error-boundary';
import StyledBadge from './components/StyledBadge.tsx';
import SpringyCard from './components/SpringyCard.tsx';


function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('user_id') ?? '';
  const { loading, status } = useLanyard({
    userId,
    socket: true,
  });

  if (userId === '') {
    return <>
      <p>Need to include a userId in the url like so:</p><br />
      <p>{location.href}?userId=3474873838384874</p>
    </>;
  }

  console.log(status);

  return (
    <ErrorBoundary fallback={<p>Whoops! An error occurred.</p>}>
      {loading || !status ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )
        : (
          <SpringyCard sx={{ display: 'flex', p: '1rem', width: '400px', maxWidth: '100%', mx: 'auto' }} direction='right'>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                size={24}
                whiteRingPx={4}
                indicatorShadow
                presence={status.discord_status}
              >
                <Avatar
                  alt={status.discord_user.global_name || ''}
                  src={format(DISCORD_AVATAR_URL, { userId, avatar: status.discord_user.avatar })}
                  sx={{
                    width: '72px',
                    height: '72px',
                    boxShadow: '0 10px 24px rgba(0,0,0,.35)',
                  }}
                />
              </StyledBadge>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto', textAlign: 'left' }}>
                <Typography component="div" variant="h5">
                  {status.discord_user.global_name || ''}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ color: 'text.secondary' }}
                >
                  {status.activities.length
                    ? <span>{getActivityType(status.activities[0].type)}&nbsp;
                      <strong>{status.activities[0].name}</strong></span>
                    : <span>Connection... untraceable</span>
                  }
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

              </Box>
            </Box>
          </SpringyCard>
        )}
    </ErrorBoundary>
  );
}


export default App;
