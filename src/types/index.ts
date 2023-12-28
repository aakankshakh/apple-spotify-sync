import {
  ApplePlaylistsResponse,
  AppleSongsResponse,
  AppleTokens,
  AppleTransforms,
  BuildAppleProvider,
} from "./apple";
import {
  BuildSpotifyProvider,
  SpotifyPlaylistsResponse,
  SpotifySongsResponse,
  SpotifyTokens,
  SpotifyTransforms,
} from "./spotify";

export enum Provider {
  "apple",
  "spotify",
}
export type UnifiedSong = {
  artists: string[];
  id: string;
  name: string;
  provider: Provider;
};
export type UnifiedPlaylist = {
  id: string;
  imageURL?: string;
  name: string;
  songs?: UnifiedSong[];
  provider: Provider;
};

export type playlistDBEntry = {
  id: string;
  playlist: UnifiedPlaylist;
  owner_id: string;
  created_at: Date | undefined;
  deleted_at: Date | undefined;
  updated_at: Date | undefined;
};

export type sync = {
  user_one: string;
  user_two: string;
  playlist_id: string;
  user_one_playlist: string;
  user_two_playlist: string;
  created_at: Date | undefined;
  deleted_at: Date | undefined;
};

// Utility types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Crud types
export type CreatePlaylist = Omit<Partial<playlistDBEntry>, "id">;
export type UpdatePlaylist = Omit<Partial<playlistDBEntry>, "id">;
export type CreateSync = sync;
// only include deleted_at
export type UpdateSync = WithOptional<sync, "user_one" | "user_two">;

type playlistRespone = {
  object: "playlist";
  data: playlistDBEntry;
  error: undefined;
};
type syncResponse = {
  object: "sync";
  data: sync;
  error: undefined;
};
type errorResponse = {
  object: "playlist" | "song" | "sync";
  data: undefined;
  error: string;
};
type successBooleanResponse = {
  object: "boolean";
  success: true;
  error: undefined;
};
type failureBooleanResponse = {
  object: "boolean";
  success: false;
  error: string;
};

type booleanResponse = successBooleanResponse | failureBooleanResponse;

export type ResponseObject =
  | booleanResponse
  | errorResponse
  | playlistRespone
  | syncResponse;

export type ProviderPlaylistResponse =
  | ApplePlaylistsResponse
  | SpotifyPlaylistsResponse;
export type ProviderSongsResponse = AppleSongsResponse | SpotifySongsResponse;
export type ProviderTransforms = AppleTransforms | SpotifyTransforms;
export type ProviderTokens = AppleTokens | SpotifyTokens;
export type BuildProviderArgs = BuildAppleProvider | BuildSpotifyProvider;
