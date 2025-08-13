import { ACTIVITY_TYPES, type ActivityType } from '../consts.ts';


export const getActivityType = (type: ActivityType): string => {
  switch (type) {
    case ACTIVITY_TYPES.STREAMING:
      return 'Streaming on';
    default:
      return 'Playing';
  }
}
