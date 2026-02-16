import { YTMDClient } from "../ytmdClient";
import { TP_ACTIONS } from "./tpConstants";

type ActionHandler = (data: any) => Promise<void> | void;

export type ActionRegistry = {
  [key in typeof TP_ACTIONS[keyof typeof TP_ACTIONS]]: ActionHandler;
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
 */
export const createActionHandlers =
  (ytmdClient: YTMDClient, playerState: any): ActionRegistry => {
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
        await ytmdClient.restClient.repeatMode(playerState.currentRepeatMode)
      },
      [ TP_ACTIONS.ytmdShuffleMode ]: async () => {
        if (playerState.currentShuffleMode === "OFF") {
          playerState.currentShuffleMode = "ON";
        } else {
          playerState.currentShuffleMode = "OFF";
        }
        await ytmdClient.restClient.shuffle();
      },
      [ TP_ACTIONS.ytmdLikeDislike ]: async (data) => {
        // Grab the current like/dislike state of the current song/video
        const actionLikeDislikeState = data.data.find(
              (item: any) => item.id === "ytmd.choice.likeDislike",
        )?.value;
        
        if (actionLikeDislikeState === "LIKE") {
          playerState.likeDislikeActionSet =
            actionLikeDislikeState === "LIKE" ? "LIKE" : "INDIFFERENT";
          // YTMD Client handles the action setting of like.
          await ytmdClient.restClient.toggleLike();
        } else if (actionLikeDislikeState === "DISLIKE") {
          playerState.likeDislikeActionSet =
            actionLikeDislikeState === "DISLIKE" ? "DISLIKE" : "INDIFFERENT";
          await ytmdClient.restClient.toggleDislike();
        }
      }
    };
  };
