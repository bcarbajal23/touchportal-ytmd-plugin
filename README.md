# TouchPortal Youtube Music Desktop Plugin

## Description
This is a [Touch Portal](https://www.touch-portal.com/) plugin for the [YouTube Music Desktop Application](https://ytmdesktop.app/). 
I developed this app in NodeJS using version 20.20. The app is packaged as a NodeJS executable so that you **do not** need to install Node for this plug-in to run.


The project was inspired by original plugin written by [KillerBOSS](https://github.com/DamienStaebler/TP-YTMD-Plugin)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#Desciption">Description</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#trouble-shooting">Trouble Shooting</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#actions">Actions</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#states">States</a></li>
      </ul>
    </li>
    <!-- <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

## Getting Started 

### Prequisites
- Running Windows 10/11, MacOs (Intel, M1, M2), Linux (Ubuntu/Debian). 
- **For MacOs users with M3 chips or newer**. Unfortunately I cannot promise this plug-in may not work for you because of Apple's requirement of ad-hoc signature for apps to run on M3 chips or later (Rosetta 2). I used [@yao-pkg/pkg](https://www.npmjs.com/package/@yao-pkg/pkg) to create the executable and they explain the [issue here](https://www.npmjs.com/package/@yao-pkg/pkg#targets).

### Installation
1. Download and install [YouTube Music Desktop App](https://ytmdesktop.app/) version 2.0 or greater.
    _* You can also download it from their [github](https://github.com/ytmdesktop/ytmdesktop) as well._
2. Download and install [Touch Portal](https://www.touch-portal.com/) as well, version 4.0 or greater.
    _* You can skip this step if you already have it installed_
3. Download the latest version of the plugin over on the right side in the releases section. 
  <!-- add image of release section here -->   
4. Open the YouTube Music Desktop App and click on the **settings cogwheel** on top right corner next to the home button.
5. Now Click on the **Integrations** tab on the left side of the panel and enable the **Companion server** toggle. This is an important step because this is how Touch Portal will be able to connect and communicate with Youtube Music.
6. Now enable the toggle for **Enable companion authorization**. Leave this window open while we set up the plug-in in Touch Portal.
<div align="center">
  <img 
  src="tutorial-assets/ytmd-settings-integration-diagram.png" 
  alt="ytmd-settings" style="width:75%;height:75%"
  /> 
</div>

7. Open Touch Portal, click on the **Quick Actions** over on the top right corner of the app and click **Import plugin**.
<div align="center">
  <img 
    src="tutorial-assets/install-plugin-diagram.png" 
    alt="install-plugin" style="width:75%;height:75%"
  />
</div>
8. Once the plug-in has finished installing, you will prompted by Touch Portal to trust the plug-in. You may press *Trust Always* (recommended) or *Yes*. Clicking on *Trust Always* will never show you that pop-up again. Clicking *Yes*, you are only trusting the plug-in for this session of Touch Portal. You will be asked to trust the plug-in again the next time you  launch Touch Portal. 
<div align="center">
  <img 
    src="tutorial-assets/touchportal-settings-approve-plugin.png" 
    alt="approve-plugin" style="width:75%;height:75%"
/>
</div>

9. Once you trust the plug-in, you see the **Companion Authorization Request** module pop up from the YouTube Music Desktop App. Go ahead and click **Allow** to complete the intregration of the plug-in.
<div align="center">
  <img 
    src="tutorial-assets/ytmd-token-sync.png" 
    alt="sync-token" style="width:75%;height:75%"
  />
</div>

  **_Notes_**: 
  - Sometimes the module may not pop-up over Touch Portal, you may have to focus on the YouTube Music Desktop App to see it. 
  - Windows Specific: You have to click on the YouTube Music App icon in the Taskbar

### Trouble Shooting
#### MacOS Users: "App is damaged" or "Unverified Developer"
If you see a warning that the plugin is "damaged and can't be opened" or "cannot be verified," this is because the plugin was not digitally signed by Apple. It is safe to use. (I do not own an Apple computer to sign the app/plug-in)

To fix this:
1.  Open your **Terminal** app.
2.  Run the following command (replace `/path/to/...` with the actual path to the plugin file inside your Touch Portal folder):
    ```bash
    xattr -cr "/Users/YOUR_USERNAME/PATH/TO/Touch Portal/plugins/ytmd_plugin_v2/ytmd-tpplugin-macos"
    ```
3.  Restart Touch Portal.

Alternatively, you can try:
1. Right-click the plugin file in Finder. (Same path as step 2 above).
2. Select **Open**.
3. Click **Open** in the dialog box that appears.

#### Windows Users: "Windows protected your PC"
If you see a blue "Windows protected your PC" window (SmartScreen):
1.  Click **More info**.
2.  Click the **Run anyway** button.

## Usage (Actions/Events/States)

<div style="display: flex;">
  <div style="flex 50%; padding: 8px;">
  
  ### Actions
  - **Playback Play/Pause**: Allows user to Play & Pause the player. 
  - **Play Next Track**: Allows user to skip to the next track.
  - **Play Previous Track**: Allows user to play previous track or restart current one. 
  - **Mute/Unmute**: Allows user toggle between muting and unmuting the player 
  - **Volume Up**: Allows user to increase player value (uses default from YTMD app).
  - **Volume Down**: Allows user to decrease player value (uses default from YTMD app).
  - **Repeat Mode**: Allows user to cycle through repeat modes (NONE, ALL, ONE).
  - **Shuffle On/Off**: Allows user toggle shuffle mode on and off.
  - **Track Like/Dislike** Allows user to like or dislike track. 
  
  ### Events
  - **YouTube Music play state changes**: Triggers Play/Pause state of player.
  - **YouTube Music audio state changes**: Triggers if the volume is increased or decreased.
  - **YouTube Music repeat mode changes**: Triggers the Repeat Mode state of player **OFF/ALL/ONE**.
  - **YouTube Music shuffle mode changes**: Triggers Shuffle Mode state of player **ON/OFF**.
  - **YouTube Music track like/dislike changes**: Triggers the Like/Dislike state of track **INDIFFERENT/LIKE/DISLIKE**.

  ### States
  - **YouTube Music play state (Play or Pause)**: Current playback state of player (Play or Pause).
  - **YouTube Music audio state (Mutes or Unmuted)**: Current audio state of player (Muted or Unmuted)
  - **YouTube Music repeat mode (NONE, ALL, ONE)**: Current state of repeat mode (NONE, ALL, ONE). 
  - **YouTube Music shuffle mode (OFF, ON)**: Current state of shuffle mode (On or Off).
  - **Track Like/Dislike (DISLIKE, INDIFFERENT, LIKE)**: Current like/dislike state of song/video (DISLIKE, INDIFFERENT, LIKE).
  </div>
  <div style="flex 50%; padding: 8px;">
  <img src="tutorial-assets/touchportal-actions-events-tab.png" alt="action-events-tab" style="width:100%;height:100%"/>
  </div>
</div>

<!-- ### Actions
- **Playback Play/Pause**: Allows user to Play & Pause the player. 
- **Play Next Track**: Allows user to skip to the next track.
- **Play Previous Track**: Allows user to play previous track or restart current one. 
- **Mute/Unmute**: Allows user toggle between muting and unmuting the player 
- **Volume Up**: Allows user to increase player value (uses default from YTMD app).
- **Volume Down**: Allows user to decrease player value (uses default from YTMD app).
- **Repeat Mode**: Allows user to cycle through repeat modes (NONE, ALL, ONE).
- **Shuffle On/Off**: Allows user toggle shuffle mode on and off.
- **Track Like/Dislike** Allows user to like or dislike track. 
 
### Events
- **YouTube Music play state changes**: Triggers Play/Pause state of player.
- **YouTube Music audio state changes**: Triggers if the volume is increased or decreased.
- **YouTube Music repeat mode changes**: Triggers the Repeat Mode state of player **OFF/ALL/ONE**.
- **YouTube Music shuffle mode changes**: Triggers Shuffle Mode state of player **ON/OFF**.
- **YouTube Music track like/dislike changes**: Triggers the Like/Dislike state of track **INDIFFERENT/LIKE/DISLIKE**.

### States
- **YouTube Music play state (Play or Pause)**: Current playback state of player (Play or Pause).
- **YouTube Music audio state (Mutes or Unmuted)**: Current audio state of player (Muted or Unmuted)
- **YouTube Music repeat mode (NONE, ALL, ONE)**: Current state of repeat mode (NONE, ALL, ONE). 
- **YouTube Music shuffle mode (OFF, ON)**: Current state of shuffle mode (On or Off).
- **Track Like/Dislike (DISLIKE, INDIFFERENT, LIKE)**: Current like/dislike state of song/video (DISLIKE, INDIFFERENT, LIKE). -->

