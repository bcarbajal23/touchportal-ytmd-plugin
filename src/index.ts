import { touchPortalClient } from './services/touchPortalClient';
import { YTMDClient } from './services/ytmdClient';


// const CONNECTORS = {
//   // volume: 
// }
(async () => {
  try {
    const tpClient = await touchPortalClient()
    const ytmdClient = new YTMDClient();
    await ytmdClient.connect();
    
    tpClient.on('Action', async (data: any) => {
      console.log(data);
      const actionId = data.actionId;
      try {
        switch (actionId) {
          case 'ytmd.action.play/pause':
            await ytmdClient.restClient.playPause();
            break;
          default:
            console.log(`No handler for action ID:  ${ actionId }`);
            break;
        }
        
        
      } catch (error) {
        console.error(`Eorror handling action ${ actionId }:`, error);
      }
    });
    
    ytmdClient.socketClient.addStateListener((state) => {
      const status = state.player.trackState ? 'PAUSED' : 'PLAYING';
      tpClient.updateSt
    });
    
  } catch (error) {
    console.error('Error Starting up TouchPortal and/or YTMD clients:', error)
    process.exit(1);
  }
})()


