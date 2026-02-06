import { touchPortalClient } from './services/touchPortalClient';
import { YTMDClient } from './services/ytmdClient';


(async () => {
  try {
    const tpClient = await touchPortalClient();
    const ytmdClient = new YTMDClient();

    let isCurrentlyMuted = false;
    
    ytmdClient.socketClient.addStateListener((state) => {
      const status = state.player?.trackState ? "Play" : "Pause";

      console.log("YTMD SocketClient Status:::::", status);
      tpClient.stateUpdate("ytmd.action.play/pause", status);
      tpClient.stateUpdate("ytmd.states.playbackState", status);
    });

    ytmdClient.socketClient.addStateListener((state) => {
      const isMuted = state.player?.muted ?? false;
      isCurrentlyMuted = isMuted;
      const audioStatus = isMuted ? "Muted" : "Unmuted";
      tpClient.stateUpdate("ytmd.action.mute/unmute", audioStatus);
      tpClient.stateUpdate("ytmd.states.mutedState", audioStatus);
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
          default:
            console.log(`No handler for action ID:  ${actionId}`);
            break;
        }
      } catch (error) {
        console.error(`Error handling action ${actionId}:`, error);
      }
    });
  } catch (error) {
    console.error('Error Starting up TouchPortal and/or YTMD clients:', error)
    process.exit(1);
  }
})()


