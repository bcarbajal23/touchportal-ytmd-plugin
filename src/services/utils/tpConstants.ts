export const PLUGIN_ID = 'ytmd_plugin_v2';

export const TP_ACTIONS = {
  ytmdPlayPause: "ytmd.action.play/pause",
  ytmdNextTrack: "ytmd.action.nextTrack",
  ytmdPrevTrack: "ytmd.action.prevTrack",
  ytmdMuteUnmute: "ytmd.action.mute/unmute",
  ytmdVolumeUp: "ytmd.action.volumeUp",
  ytmdVolumeDown: "ytmd.action.volumeDown",
  ytmdRepeatMode: "ytmd.action.repeatMode",
  ytmdShuffleMode: "ytmd.action.shuffleMode",
  ytmdLikeDislike: "ytmd.action.like/dislike",
} as const;

export const TP_EVENTS = {
  ytmdEventPlayback: "ytmd.event.playback",
  ytmdEventAudioPlayback: "ytmd.event.audioPlayback",
  ytmdEventRepeatMode: "ytmd.event.repeatMode",
  ytmdEventShuffleMode: "ytmd.event.shuffleMode",
  ytmdEventLikeDislike: "ytmd.event.likeDislike",
} as const;

export const TP_STATES = {
  ytmdPlaybackState: "ytmd.states.playbackState",
  ytmdMutedState: "ytmd.states.mutedState",
  ytmdRepeatMode: "ytmd.states.repeatMode",
  ytmdShuffleMode: "ytmd.states.shuffleMode",
  ytmdLikeDislike: "ytmd.states.likeDislike",
} as const;

