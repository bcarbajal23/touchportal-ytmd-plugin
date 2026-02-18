import { touchPortalClient } from "./services/touchPortalClient";
import { ActionId, ActionRegistry, createActionHandlers } from "./services/utils/actionHandlers";
import { TP_ACTIONS, TP_STATES } from "./services/utils/tpConstants";
import { YTMDClient } from "./services/ytmdClient";

interface PlayerState {
  isCurrentlyMuted: boolean | null;
  currentRepeatMode: number;
  currentShuffleMode: string;
  likeDislikeActionSet: string;
  lastPlayState: string;
}
const playerState: PlayerState = {
  isCurrentlyMuted: null,
  currentRepeatMode: -1,
  currentShuffleMode: "",
  likeDislikeActionSet: "",
  lastPlayState: "",
};

(async () => {
  try {
    const tpClient = await touchPortalClient();
    const ytmdClient = new YTMDClient();
    const actionHandlers: ActionRegistry = createActionHandlers(ytmdClient, playerState, tpClient);
    
    ytmdClient.socketClient.addStateListener((state) => {
      if (!state || !state.player || !state.video) return;
      
      const status = state.player?.trackState ? "Play" : "Pause";
      /**
       * Get the song details. 
       * Currently not using Author, title, or Album but could be used
       * in the future. 
       */
      const { author, title, likeStatus, album } = state.video ?? {};

      /**
       * Handle the Playing and Pausing of the player. Will only trigger and update
       * if the state of the player has changed. That way it will not flood updates to
       * Touch Portal whenever a different action on the player is triggered, 
       * i.e. pressing next track or like or disliking a song.
       */
      if (playerState.lastPlayState !== status) {
        playerState.lastPlayState = status;
        console.log("YTMD SocketClient Player Status:::::", status);
        tpClient.stateUpdate(TP_ACTIONS.ytmdPlayPause, status);
        tpClient.stateUpdate(TP_STATES.ytmdPlaybackState, status); 
      }
      
      const isMuted = state.player?.muted ?? false;
      /**
       * Handle Muting and Unmuting of the song/video. To avoid flooding updates to
       * the state in Touch Portal, only update if the state of the player has changed.
       */
      if (playerState.isCurrentlyMuted !== isMuted) {
        playerState.isCurrentlyMuted = isMuted;
        const audioStatus = isMuted ? "Muted" : "Unmuted";
        tpClient.stateUpdate(TP_ACTIONS.ytmdMuteUnmute, audioStatus);
        tpClient.stateUpdate(TP_STATES.ytmdMutedState, audioStatus);
      }
      
      // Handle the Cycling of Repeat Mode.
      const repeatMode = state.player?.queue?.repeatMode ?? 0;
      /**
       * Only send the update if the repeat mode state changes. This will avoid flooding 
       * Touch Portal with unnecessary state updates.
       */
      if (playerState.currentRepeatMode !== repeatMode) {
        const repeatModeStr =
          repeatMode === 0 ? "NONE" : repeatMode === 1 ? "ALL" : "ONE";
        playerState.currentRepeatMode = repeatMode;
        
        tpClient.stateUpdate(TP_ACTIONS.ytmdRepeatMode, repeatModeStr);
        tpClient.stateUpdate(TP_STATES.ytmdRepeatMode, repeatModeStr);
      }
      
      // Handle Like and Dislike of song/video.
      const videoLikeStatus = state.video?.likeStatus as number;
      if (videoLikeStatus !== undefined) {
        const videoLikedStatusStr =
        videoLikeStatus === 0
          ? "DISLIKE"
          : videoLikeStatus === 1
            ? "INDIFFERENT"
            : "LIKE";

        /**
         * Only send the update to the state if the like/dislike status changes for the 
         * current song/video. This will avoid YTMD from flooding Touch Portal with 
         * state updates.
         */
        if (playerState.likeDislikeActionSet !== videoLikedStatusStr) {   
          playerState.likeDislikeActionSet = videoLikedStatusStr;
          tpClient.stateUpdate(TP_ACTIONS.ytmdLikeDislike, videoLikedStatusStr);
          tpClient.stateUpdate(TP_STATES.ytmdLikeDislike, videoLikedStatusStr);
        }
       }
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
      const actionId: ActionId = data.actionId;
      console.log("TPClient Action ID:::::", actionId);
      
      const actionHandler = actionHandlers[ actionId ];
      if (!actionHandler) {
        console.warn(`[TouchPortal]: Action ${ actionId } not found in ActionRegistry`);
        return;
      }
      
      try {
        await actionHandler(data);
      } catch (error) {
        console.error(
          `Error handling action ${ actionId }; it may not be in ActionRegistry:`, error
        );
      }
      
    });
  } catch (error) {
    console.error("Error Starting up TouchPortal and/or YTMD clients:", error);
    process.exit(1);
  }
})();
