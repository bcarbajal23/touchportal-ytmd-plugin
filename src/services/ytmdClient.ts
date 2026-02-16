import fs from 'fs';
import path from 'path';
import { CompanionConnector, RestClient, Settings, SocketClient } from 'ytmdesktop-ts-companion';

const DEFAULT_DELAY = 2000;
const MAX_ATTEMPTS = 15;
export class YTMDClient {
  private companionConnector: CompanionConnector;
  public restClient: RestClient;
  public socketClient: SocketClient;
  private tokenPath: string;
  
  constructor(host: string = "127.0.0.1", port: number = 9863) {
    const exeDir = path.dirname(process.execPath);
    const pluginRootDir = path.join(exeDir, '.');
    
    this.tokenPath = path.join(pluginRootDir, ".token");
    
    const version = this.getVersion();
    const settings: Settings = {
      host: host,
      port: port,
      appId: "touchportal-ytmdesktop-plugin",
      appName: "TouchPortal YTMDesktop Plugin",
      appVersion: version,
    };

    this.companionConnector = new CompanionConnector(settings);
    this.restClient = this.companionConnector.restClient;
    this.socketClient = this.companionConnector.socketClient;
  }

  /**
   * Initialize connection with ytmd app and handle autherization flow.
   */
  public async connect(): Promise<void> {
    const token = this.getToken() || "";

    if (token) {
      this.companionConnector.setAuthToken(token);
    } else {
      await this.syncNewAuthToken();
    }
    this.socketClient.connect();
  }

  private getVersion(): string {
    try {
      const packageJsonPath = path.join(__dirname, "..", "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      return packageJson.version || "1.0.0";
    } catch {
      return "1.0.0";
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async syncNewAuthToken(): Promise<void> {
    try {
      // request new auth token
      const response = await this.restClient.getAuthCode();

      let token = null;
      let attempts = 0;

      /**
       * Wait for the user to click the token modal.
       * YTMD closes the modal after 30 seconds.
       */
      while (!token && attempts < MAX_ATTEMPTS) {
        try {
          await this.delay(DEFAULT_DELAY);
          //get token
          const tokenResponse = await this.restClient.getAuthToken(
            response.code,
          );
          
          token = tokenResponse.token;
          this.companionConnector.setAuthToken(token);
          this.saveToken(token);
          return;
        } catch (error) {
          attempts++;
        }
      }

      throw new Error(
        "Authentication Timeout. User did not click 'Allow' in time.",
      );
      
      // fs.writeFileSync(this.tokenPath, token, "utf-8");
    } catch (error) {
      console.error("Error during auth token synchronization:", error);
      throw error;
    }
  }

  private saveToken(token: string): void {
    try {
      if (token) {
      fs.writeFileSync(token, token, "utf-8");
    }
    } catch (error) {
      console.log("");
    }
    
  }
  
  private getToken(): string | null {
    try {
      const token = fs.readFileSync(this.tokenPath, "utf-8").trim();
      return token || null;
    } catch {
      return null;
    }
  }
}
