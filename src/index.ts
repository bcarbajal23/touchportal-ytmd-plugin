import {
  touchPortalClient,
  TP_ACTIONS,
  TP_STATES,
} from "./services/touchPortalClient";
import { YTMDClient } from "./services/ytmdClient";

(async () => {
  try {
    const tpClient = await touchPortalClient();
    const ytmdClient = new YTMDClient();

    let isCurrentlyMuted = false;
    let currentRepeatMode = 0;

    ytmdClient.socketClient.addStateListener((state) => {
      const status = state.player?.trackState ? "Play" : "Pause";

      console.log("YTMD SocketClient Status:::::", status);
      tpClient.stateUpdate(TP_ACTIONS.ytmdPlayPause, status);
      tpClient.stateUpdate(TP_STATES.ytmdPlaybackState, status);
    });

    ytmdClient.socketClient.addStateListener((state) => {
      const isMuted = state.player?.muted ?? false;
      isCurrentlyMuted = isMuted;
      const audioStatus = isMuted ? "Muted" : "Unmuted";
      tpClient.stateUpdate(TP_ACTIONS.ytmdMuteUnmute, audioStatus);
      tpClient.stateUpdate(TP_STATES.ytmdMutedState, audioStatus);
    });

    ytmdClient.socketClient.addStateListener((state) => {
      const repeatMode = state.player?.queue?.repeatMode ?? 0;
      const repeatModeStr =
        repeatMode === 0 ? "NONE" : repeatMode === 1 ? "ALL" : "ONE";
      currentRepeatMode = repeatMode + 1;
      /**
       * Reset to 0 if repeat mode is greater than 2
       * @see {@link https://github.com/XeroxDev/ytmdesktop-ts-companion/blob/main/src/enums/repeat-mode.ts}
       *
       */
      if (currentRepeatMode > 2) currentRepeatMode = 0;

      tpClient.stateUpdate(TP_ACTIONS.ytmdRepeatMode, repeatModeStr);
      tpClient.stateUpdate(TP_STATES.ytmdRepeatMode, repeatModeStr);
    });

    ytmdClient.socketClient.addConnectionStateListener((state) => {
      console.log("YTMD SocketClient Connection State:::::", state);
    });

    await ytmdClient.connect();

    tpClient.on("Action", async (data: any) => {
      console.log("TPClient Action:::::", data);
      const actionId = data.actionId;
      console.log("TPClient Action ID:::::", actionId);
      try {
        switch (actionId) {
          case "ytmd.action.play/pause":
            await ytmdClient.restClient.playPause();
            break;
          case "ytmd.action.nextTrack":
            await ytmdClient.restClient.next();
            break;
          case "ytmd.action.prevTrack":
            await ytmdClient.restClient.previous();
            break;
          case "ytmd.action.mute/unmute":
            if (isCurrentlyMuted) {
              await ytmdClient.restClient.unmute();
            } else {
              await ytmdClient.restClient.mute();
            }
            break;
          case "ytmd.action.volumeUp":
            await ytmdClient.restClient.volumeUp();
            break;
          case "ytmd.action.volumeDown":
            await ytmdClient.restClient.volumeDown();
            break;
          case "ymtd.action.repeatMode":
            await ytmdClient.restClient.repeatMode(currentRepeatMode);
            break;
          default:
            console.log(`No handler for action ID:  ${actionId}`);
            break;
        }
      } catch (error) {
        console.error(`Error handling action ${actionId}:`, error);
      }
    });
  } catch (error) {
    console.error("Error Starting up TouchPortal and/or YTMD clients:", error);
    process.exit(1);
  }
})();
