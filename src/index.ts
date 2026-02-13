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
    let currentShuffleMode = "OFF";
    let likeDislikeActionSet = "";
    let lastPlayState = "";

    // State listener for Playing and Pausing Player
    ytmdClient.socketClient.addStateListener((state) => {
      const status = state.player?.trackState ? "Play" : "Pause";
      const { author, title, likeStatus, album } = state.video ?? {};

      if (lastPlayState === status) return;
      lastPlayState = status;
      console.log("YTMD SocketClient Player Status:::::", status);
      tpClient.stateUpdate(TP_ACTIONS.ytmdPlayPause, status);
      tpClient.stateUpdate(TP_STATES.ytmdPlaybackState, status);

      /**
       * So that the song/video Like/Dislike status appears properly
       * on first start up of the plugin
       */
      const videoLikedStatusStr =
        likeStatus === 0
          ? "DISLIKE"
          : likeStatus === 1
            ? "INDIFFERENT"
            : "LIKE";

      tpClient.stateUpdate(TP_ACTIONS.ytmdLikeDislike, videoLikedStatusStr);
      tpClient.stateUpdate(TP_STATES.ytmdLikeDislike, videoLikedStatusStr);
    });

    // State listener for Muted and Unmuted Player
    ytmdClient.socketClient.addStateListener((state) => {
      const isMuted = state.player?.muted ?? false;

      if (isCurrentlyMuted === isMuted) return;
      isCurrentlyMuted = isMuted;
      const audioStatus = isMuted ? "Muted" : "Unmuted";
      tpClient.stateUpdate(TP_ACTIONS.ytmdMuteUnmute, audioStatus);
      tpClient.stateUpdate(TP_STATES.ytmdMutedState, audioStatus);
    });

    // State lister for Repeat and Non-Repeat Mode
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

    // State lister for Shuffle and Non-Shuffle Mode
    ytmdClient.socketClient.addStateListener((state) => {
      const shuffleMode = currentShuffleMode;
      tpClient.stateUpdate(TP_ACTIONS.ytmdShuffleMode, shuffleMode);
      tpClient.stateUpdate(TP_STATES.ytmdShuffleMode, shuffleMode);
    });

    ytmdClient.socketClient.addStateListener((state) => {
      if (!state.video || !state.video?.likeStatus) return;

      const videoLikeStatus = state.video?.likeStatus as number;
      const videoLikedStatusStr =
        videoLikeStatus === 0
          ? "DISLIKE"
          : videoLikeStatus === 1
            ? "INDIFFERENT"
            : "LIKE";

      /**
       * if the song/video is neither LIKE or DISLIKE, then it is INDIFFERENT
       * and will break out of the stateUpdate listener
       */
      let indiffLikeState = "INDIFFERENT";
      if (indiffLikeState === likeDislikeActionSet) return;

      tpClient.stateUpdate(TP_ACTIONS.ytmdLikeDislike, videoLikedStatusStr);
      tpClient.stateUpdate(TP_STATES.ytmdLikeDislike, videoLikedStatusStr);
    });

    ytmdClient.socketClient.addConnectionStateListener((state) => {
      console.log("YTMD SocketClient Connection State:::::", state);
    });

    await ytmdClient.connect();

    tpClient.on("Close", () => {
      console.log("Closing Touch Portal connection...");
      ytmdClient.socketClient.removeAllStateListeners();
      ytmdClient.socketClient.removeAllConnectionStateListeners();
      process.exit(0);
    });

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
          case "ytmd.action.repeatMode":
            await ytmdClient.restClient.repeatMode(currentRepeatMode);
            break;
          case "ytmd.action.shuffleMode":
            if (currentShuffleMode === "OFF") {
              currentShuffleMode = "ON";
            } else {
              currentShuffleMode = "OFF";
            }
            await ytmdClient.restClient.shuffle();
            break;
          case "ytmd.action.like/dislike":
            const actionLikeDislikeState = data.data.find(
              (item: any) => item.id === "ytmd.choice.likeDislike",
            )?.value;

            if (!actionLikeDislikeState) break;

            if (actionLikeDislikeState === "LIKE") {
              likeDislikeActionSet =
                actionLikeDislikeState === "LIKE" ? "LIKE" : "INDIFFERENT";
              await ytmdClient.restClient.toggleLike();
            } else if (actionLikeDislikeState === "DISLIKE") {
              likeDislikeActionSet =
                actionLikeDislikeState === "DISLIKE"
                  ? "DISLIKE"
                  : "INDIFFERENT";
              await ytmdClient.restClient.toggleDislike();
            }
            break;
          default:
            console.log(`No handler for action ID:  ${actionId}`);
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
