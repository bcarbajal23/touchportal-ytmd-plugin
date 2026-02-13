# TouchPortal Youtube Music Desktop Plugin

## Description
This is a [Touch Portal](https://www.touch-portal.com/) plugin for the [YouTube Music Desktop Application](https://ytmdesktop.app/).

The project was inspired by original plugin written by [KillerBOSS](https://github.com/DamienStaebler/TP-YTMD-Plugin)

## Installation

## Actions
- **Playback Play/Pause**: Allows user to Play & Pause the player. 
- **Play Next Track**: Allows user to skip to the next track.
- **Play Previous Track**: Allows user to play previous track or restart current one. 
- **Mute/Unmute**: Allows user toggle between muting and unmuting the player 
- **Volume Up**: Allows user to increase player value (uses default from YTMD app).
- **Volume Down**: Allows user to decrease player value (uses default from YTMD app).
- **Repeat Mode**: Allows user to cycle through repeat modes (NONE, ALL, ONE).
- **Shuffle On/Off**: Allows user toggle shuffle mode on and off.
- **Track Like/Dislike** Allows user to like or dislike track. 
 
## Events
- **YouTube Music play state changes**: Triggers Play/Pause state of player.
- **YouTube Music audio state changes**: Triggers if the volume is increased or decreased.
- **YouTube Music repeat mode changes**: Triggers the Repeat Mode state of player **OFF/ALL/ONE**.
- **YouTube Music shuffle mode changes**: Triggers Shuffle Mode state of player **ON/OFF**.
- **YouTube Music track like/dislike changes**: Triggers the Like/Dislike state of track **INDIFFERENT/LIKE/DISLIKE**.

## States
- **YouTube Music play state (Play or Pause)**: Current playback state of player (Play or Pause).
- **YouTube Music audio state (Mutes or Unmuted)**: Current audio state of player (Muted or Unmuted)
- **YouTube Music repeat mode (NONE, ALL, ONE)**: Current state of repeat mode (NONE, ALL, ONE). 
- **YouTube Music shuffle mode (OFF, ON)**: Current state of shuffle mode (On or Off).
- **Track Like/Dislike (DISLIKE, INDIFFERENT, LIKE)**: Current like/dislike state of song/video (DISLIKE, INDIFFERENT, LIKE).

