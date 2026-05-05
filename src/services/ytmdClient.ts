import fs from "fs";
import path from "path";
import os from "os";
import { PLUGIN_VERSION } from "../version";
import {
  CompanionConnector,
  RestClient,
  Settings,
  SocketClient,
} from "ytmdesktop-ts-companion";

const DEFAULT_DELAY = 2000;
const MAX_ATTEMPTS = 15;
export class YTMDClient {
  private companionConnector: CompanionConnector;
  public restClient: RestClient;
  public socketClient: SocketClient;
  private tokenPath: string;

  constructor(host: string = "127.0.0.1", port: number = 9863) {
    const dirData = process.env.APPDATA
      ? path.join(process.env.APPDATA, "touchportal-ytmd-plugin")
      : path.join(os.homedir(), ".touchportal-ytmd-plugin");

    if (!fs.existsSync(dirData)) {
      fs.mkdirSync(dirData, { recursive: true })
    }
    this.tokenPath = path.join(dirData, ".token");

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
    const token = await this.getToken() ?? "";
    if (token && token !== "") {
      this.companionConnector.setAuthToken(token);
    } else {
      await this.syncNewAuthToken();
    }
    this.socketClient.connect();
  }

  /**
   * reauthConnection()
   * - will delete the old stale auth token saved and will
   *   reauthenicate a new connection to YTMD.
   */
  public async reauthConnection(): Promise<void> {
    try {
      console.log("Re-authenticatin YTMD connection...");

      await this.clearStaleToken();

      await this.syncNewAuthToken();
      this.socketClient.connect();
    } catch (error) {
      console.log("There was an error re-authenticating", error);
      throw error;
    }
  }

  private getVersion(): string {
    return PLUGIN_VERSION ?? "1.0.0";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async clearStaleToken(): Promise<void> {
    try {
      if (fs.existsSync(this.tokenPath)) {
        await fs.promises.unlink(this.tokenPath);
      }
    } catch (error) {
      console.log("Could not delete the stale ytmd auth token", error);
    }

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
    } catch (error) {
      console.error("Error during auth token synchronization:", error);
      throw error;
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      if (token) {
        await fs.promises.writeFile(this.tokenPath, token, "utf-8");
      }
    } catch (error) {
      console.log("SaveToken::: Could not write token", error);
    }
  }

  private async getToken(): Promise<string> {
    try {
      const token = await fs.promises.readFile(this.tokenPath, "utf-8");
      return token.trim();
    } catch {
      return "";
    }
  }
}
