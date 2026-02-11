import 'ytmdesktop-ts-companion';

/**
 * Add the `muted` property missing the Player interface but is present
 * in the `PlayerState` interface in the YouTube Music Desktop interface
 * @see {@link https://github.com/ytmdesktop/ytmdesktop/blob/development/src/main/player-state-store/index.ts}
 */
declare module 'ytmdesktop-ts-companion' {
  interface Player {
    muted: boolean;
  }
}