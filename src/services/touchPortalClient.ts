import * as TouchPortalApi from 'touchportal-api';
import { PLUGIN_ID } from './utils/tpConstants';

export async function touchPortalClient(): Promise<InstanceType<typeof TouchPortalApi.Client>> {
  console.log('Initializing TouchPortal client...');
  
  const touchPortalClient = new TouchPortalApi.Client();
  
  touchPortalClient.on('Close', () => {
    console.log('Closing Touch Portal connection...');
    process.exit(0);
  });
  
  await touchPortalClient.connect({ pluginId: PLUGIN_ID });
  
  return touchPortalClient;
}
