import { ACTIVITY_TYPES } from '../consts.ts';


export const getActivityType = (type: ACTIVITY_TYPES): string => {
  switch (type) {
    case ACTIVITY_TYPES.STREAMING:
      return 'Streaming on';
    default:
      return 'Playing';
  }
}
