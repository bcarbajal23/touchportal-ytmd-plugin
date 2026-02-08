import * as TouchPortalApi from 'touchportal-api';

export const TP_ACTIONS = {
  ytmdPlayPause: "ytmd.action.play/pause",
  ytmdNextTrack: "ytmd.action.nextTrack",
  ytmdPrevTrack: "ytmd.action.prevTrack",
  ytmdMuteUnmute: "ytmd.action.mute/unmute",
  ytmdVolumeUp: "ytmd.action.volumeUp",
  ytmdVolumeDown: "ytmd.action.volumeDown",
  ytmdRepeatMode: "ytmd.action.repeatMode",
  ytmdShuffleMode: "ytmd.action.shuffleMode",
};

export const TP_EVENTS = {
  ytmdEventPlayback: "ytmd.event.playback",
  ytmdEventAudioPlayback: "ytmd.event.audioPlayback",
  ytmdEventRepeatMode: "ytmd.event.repeatMode",
  ytmdEventShuffleMode: "ytmd.event.shuffleMode",
};

export const TP_STATES = {
  ytmdPlaybackState: "ytmd.states.playbackState",
  ytmdMutedState: "ytmd.states.mutedState",
  ytmdRepeatMode: "ytmd.states.repeatMode",
  ytmdShuffleMode: "ytmd.states.shuffleMode",
};

const PLUGIN_ID = 'ytmd_plugin_v2';
export async function touchPortalClient(): Promise<any> {
  console.log('Initializing TouchPortal client...');
  
  const touchPortalClient = new TouchPortalApi.Client();
  
  touchPortalClient.on('Close', () => {
    console.log('Closing Touch Portal connection...');
    process.exit(0);
  });
  
  await touchPortalClient.connect({ pluginId: PLUGIN_ID });
  
  return touchPortalClient;
}