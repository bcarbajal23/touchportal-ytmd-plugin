import { YTMDClient } from "../ytmdClient";
import { TP_ACTIONS, TP_STATES } from "./tpConstants";

export type ActionHandler = (data: any) => Promise<void> | void;

export type ActionId = typeof TP_ACTIONS[ keyof typeof TP_ACTIONS ];

export type ActionRegistry = {
  [key in ActionId]: ActionHandler;
};

/**
 * Action Handlers Registry for Touch Portal to interface and communicate with
 * the YouTube Music Desktop App.
 * @param ytmdClient - ytmd client used to call the Rest Client to perform actions
 *  i.e. toggle play/pause, like or dislike a track, etc.
 * @param playerState - current state of the player
 * @returns { ActionRegistry} A Mapping of all the Touch Portal Actions to the corresponding
 * YouTube Music Desktop App Rest Client actions.
 * 
 * It will make it easier to add more actions later if more features are added.
 */
export const createActionHandlers =
  (ytmdClient: YTMDClient, playerState: any, tpClient: any): ActionRegistry => {
    return {
      [ TP_ACTIONS.ytmdPlayPause ]: async () => {
        await ytmdClient.restClient.playPause();
      },
      [ TP_ACTIONS.ytmdNextTrack ]: async () => {
        await ytmdClient.restClient.next();
      },
      [ TP_ACTIONS.ytmdPrevTrack ]: async () => {
        await ytmdClient.restClient.previous();
      },
      [ TP_ACTIONS.ytmdMuteUnmute ]: async () => {
        if (playerState.isCurrentlyMuted) {
          await ytmdClient.restClient.unmute();
        } else {
          await ytmdClient.restClient.mute();
        }
      },
      [ TP_ACTIONS.ytmdVolumeUp ]: async () => {
        await ytmdClient.restClient.volumeUp();
      },
      [ TP_ACTIONS.ytmdVolumeDown ]: async () => {
        await ytmdClient.restClient.volumeDown()
      },
      [ TP_ACTIONS.ytmdRepeatMode ]: async () => {
        const rolloverRepeatMode = (playerState.currentRepeatMode + 1) % 3;
        
        await ytmdClient.restClient.repeatMode(rolloverRepeatMode);
      },
      [ TP_ACTIONS.ytmdShuffleMode ]: async () => {
        /**
         * Toggle shuffle mode ON and OFF. 
         * The logic is moved here so that YTMD does not spam Touch Portal 
         * with updating the shuttle state every second. This will only now
         * update when the button is pressed.
         */
        
        if (playerState.currentShuffleMode === "OFF") {
          playerState.currentShuffleMode = "ON";
        } else {
          playerState.currentShuffleMode = "OFF";
        }
        tpClient.stateUpdate(TP_ACTIONS.ytmdShuffleMode, playerState.currentShuffleMode);
        tpClient.stateUpdate(TP_STATES.ytmdShuffleMode, playerState.currentShuffleMode);
        
        await ytmdClient.restClient.shuffle();
      },
      [ TP_ACTIONS.ytmdLikeDislike ]: async (data) => {
        // Grab the current like/dislike state of the current song/video
        const actionLikeDislikeState = data.data.find(
              (item: any) => item.id === "ytmd.choice.likeDislike",
        )?.value;
        
        if (actionLikeDislikeState === "LIKE") {
          await ytmdClient.restClient.toggleLike();
        } else if (actionLikeDislikeState === "DISLIKE") {
          await ytmdClient.restClient.toggleDislike();
        }
        
      }
    };
  };
