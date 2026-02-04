import * as TouchPortalApi from 'touchportal-api';

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