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
    return {
      activityAction: 'Streaming',
      name: activity.name,
      text: [
        `Streaming on ${activity.name}`,
        activity.details ?? '',
        `${activity.state}`,
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
    ],
  };
};
