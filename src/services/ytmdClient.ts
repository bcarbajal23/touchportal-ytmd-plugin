import fs from 'fs';
import path from 'path';
import { CompanionConnector, RestClient, Settings, SocketClient } from 'ytmdesktop-ts-companion';


export class YTMDClient {
  private companionConnector: CompanionConnector;;
  public restClient: RestClient;
  public socketClient: SocketClient;
  private tokenPath: string;
  constructor() {
    this.tokenPath = path.join(__dirname, "..", ".token");
    
    const version = this.getVersion();
    const settings: Settings = {
      host: '127.0.0.1',
      port: 9863,
      appId: 'touchportal-ytmdesktop-plugin',
      appName: 'TouchPortal YTMDesktop Plugin',
      appVersion: version,
    };
    
    this.companionConnector = new CompanionConnector(settings);
    this.restClient = this.companionConnector.restClient;
    this.socketClient = this.companionConnector.socketClient;
  }
  
  /**
   * Initialize connection with ytmd app and handle autherization flow.
   */
  public async connect(): Promise<void>{
    const token = this.getToken();
    
    if (token) {
      this.companionConnector.setAuthToken(token);
    } else {
      await this.syncNewAuthToken();
    }
  }
  
  private getVersion(): string {
    try {
      const packageJsonPath = path.join(__dirname, "..", "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }
  
  private async syncNewAuthToken(): Promise<void> {
    try {
      // request new auth token
      const response = await this.restClient.getAuthCode();
      
      //get token
      const tokenResponse = await this.restClient.getAuthToken(response.code);
      const token = tokenResponse.token;
      
      this.companionConnector.setAuthToken(token);
      fs.writeFileSync(this.tokenPath, token, 'utf-8');
    } catch (error) {
      console.error('Error during auth token synchronization:', error);
      throw error;
    }
  }
  private setToken(tokenPath: string):void {
    
  }
  
  
  private getToken(): string | null {
    try {
      const token = fs.readFileSync(this.tokenPath, 'utf-8').trim();
      return token || null;
    } catch {
      return null;
    }
  }
}