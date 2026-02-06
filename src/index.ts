import { touchPortalClient } from './services/touchPortalClient';
import { YTMDClient } from './services/ytmdClient';


(async () => {
  try {
    const tpClient = await touchPortalClient();
    const ytmdClient = new YTMDClient();

    ytmdClient.socketClient.addStateListener((state) => {
      const status = state.player.trackState ? "Play" : "Pause";
      console.log("YTMD SocketClient Status:::::", status);
      tpClient.stateUpdate("ytmd.action.play/pause", status);
      tpClient.stateUpdate("ytmd.states.playbackState", status);
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


