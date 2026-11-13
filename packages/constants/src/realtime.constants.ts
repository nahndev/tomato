export const RealtimeEvent = {
  SUBMISSION_VALUES: 'submission.values',
  SUBMISSION_SUMMARY: 'submission.summary',
  SUBMISSION_GRAPH_CHANGED: 'submission.graph-changed',
} as const;
export type RealtimeEvent = (typeof RealtimeEvent)[keyof typeof RealtimeEvent];

export const RealtimeRoom = {
  BOARD: 'board',
  SUBMISSION: 'submission',
} as const;
export type RealtimeRoom = (typeof RealtimeRoom)[keyof typeof RealtimeRoom];

export const REALTIME_ROOM_SEPARATOR = ':';
export const REALTIME_ROOMS_SEPARATOR = ',';
