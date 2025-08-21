import { ACTIVITY_TYPES } from '../consts.ts';
import type { Activity as LanyardActivity } from 'react-use-lanyard';

type Activity = LanyardActivity & {
  url?: string;
}

type ActivityAction = {
  activityAction: 'Playing' | 'Streaming' | 'Listening to';
  name: string;
  text: string[];
  url?: string;
}

export const usePrimaryActivity = (activities: Activity[] | undefined): ActivityAction | null => {
  if (!activities) {
    return null;
  }

  // Search for streaming
  const isStreaming = activities.filter(activity => activity.type === ACTIVITY_TYPES.STREAMING);

  if (isStreaming.length) {
    // Let's only return the first streaming service for now
    // (I don't even think Discord shows anything other than Twitch anyway)
    const activity = isStreaming[0];
    const [game] = activities.filter(game => game.name === activity.state);
    const baseText = [
      `Streaming on ${activity.name}`,
      activity.details ?? '',
      `${activity.state}`,
    ];

    return {
      activityAction: 'Streaming',
      name: activity.name,
      text: [
        ...baseText,
        ...(game ? [
          `${game.details ? game.details : ''}`,
          `${game.state}${game.party ? ` (${game.party.size?.[0]} of ${game.party.size?.[1]})` : ''}`,
        ] : []),
      ],
      url: activity.url,
    };
  }

  // Use the first activity for now
  const activity = activities[0];
  return {
    activityAction: 'Playing',
    name: activity.name,
    text: [
      `Playing ${activity.name}`,
      `${activity.state}${activity.party ? ` (${activity.party.size?.[0]} of ${activity.party.size?.[1]})` : ''}`,
    ],
  };
};
