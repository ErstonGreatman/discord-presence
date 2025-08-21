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


/**
 * Formats a given elapsed time in milliseconds into a string representation
 * showing hours and minutes.
 *
 * @param {number} ms - The elapsed time in milliseconds. Must be a non-negative finite number.
 * @return {string} The formatted elapsed time as a string. If the input is invalid or less than zero, returns "0m".
 */
export function formatElapsed(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0m";

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return hours > 0 ? `${hours}hr${hours > 1 ? 's' : ''}. ${pad(minutes)}min.` : `${minutes}min.`;
}


/**
 * Determines the primary activity or action to be displayed from a list of activities,
 * prioritizing streaming activities over other types.
 *
 * @param {Activity[] | undefined} activities - An array of activity objects or undefined if no activities are available.
 * @returns {ActivityAction | null} The primary activity action to display, or `null` if no activities are available.
 *
 * The function performs the following operations:
 * 1. If the `activities` array is undefined, it immediately returns `null`.
 * 2. Searches the `activities` array for any streaming activities (type `ACTIVITY_TYPES.STREAMING`).
 *    - If a streaming activity is found, it constructs an `ActivityAction` object with details such as the streaming platform, duration, activity details, and optional game information if available.
 * 3. If no streaming activities are found, it falls back to using the first activity in the array to construct an `ActivityAction`.
 * 4. Includes auxiliary details such as elapsed time, activity state, game details, and party size, where applicable.
 *
 * Note that the function assumes only a single streaming activity is of relevance at a time,
 * and it defaults to the first streaming activity if there are multiple present. Mostly because I'm pretty sure Discord
 * only recognizes Twitch at the moment.
 */
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
    const uptime = formatElapsed(Date.now() - (activity.timestamps?.start ?? 0));
    const baseText = [
      `Streaming on ${activity.name} • Live for ${uptime}`,
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
          `${game.state ? game.state : ''}${game.party ? ` (${game.party.size?.[0]} of ${game.party.size?.[1]})` : ''}`,
        ] : []),
      ],
      url: activity.url,
    };
  }

  // Use the first activity for now
  const activity = activities[0];
  const playtime = formatElapsed(Date.now() - (activity.timestamps?.start ?? 0))
  return {
    activityAction: 'Playing',
    name: activity.name,
    text: [
      `Playing ${activity.name}`,
      `Playing for ${playtime}`,
      `${activity.state ? activity.state : ''}${activity.party ? ` (${activity.party.size?.[0]} of ${activity.party.size?.[1]})` : ''}`,
    ],
  };
};
