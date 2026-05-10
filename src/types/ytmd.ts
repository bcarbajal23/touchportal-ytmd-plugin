export interface PlayerState {
  isCurrentlyMuted: boolean | null;
  currentRepeatMode: number;
  currentShuffleMode: string;
  likeDislikeActionSet: string;
  lastPlayState: string;
}
