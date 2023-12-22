import { BuildProviderArgs, Provider } from "../../../types";
import AppleMusicProvider from "./apple";
import SpotifyMusicProvider from "./spotify";
import { MusicProvider } from "./_provider";

export const buildProvider = (args: BuildProviderArgs): MusicProvider => {
  const { provider, tokens } = args;

  switch (provider) {
    case Provider.apple:
      return new AppleMusicProvider(tokens);
    case Provider.spotify:
      return new SpotifyMusicProvider(tokens);
  }
};
