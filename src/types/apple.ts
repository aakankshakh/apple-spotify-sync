import { Provider, UnifiedPlaylist, UnifiedSong } from ".";

type AppleArtwork = {
  width: number | null;
  height: number | null;
  url: string;
};
type ApplePlayParams = {
  id: string;
  kind: string;
  isLibrary: boolean;
  globalId: string;
};
type AppleObject<T> = {
  href: string;
  id: string;
  type: "library-playlists" | "library-songs";
  attributes: T;
};

export type ApplePlaylist = AppleObject<{
  artwork?: AppleArtwork;
  canEdit: boolean;
  dateAdded: string;
  hasCatalog: boolean;
  isPublic: boolean;
  lastModifiedDate: string;
  name: string;
  playParams: ApplePlayParams;
}>;

export type AppleSong = AppleObject<{
  albumName: string;
  artistName: string;
  artwork?: AppleArtwork;
  contentRating: string;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  name: string;
  playParams: ApplePlayParams;
  releaseDate: string;
  trackNumber: number;
}>;

type AppleListResponse<T> = {
  href: string;
  next: string;
  data: T;
  meta: {
    total: number;
  };
};
export type ApplePlaylistsResponse = AppleListResponse<ApplePlaylist[]>;
export type AppleSongsResponse = AppleListResponse<AppleSong[]>;
export type AppleTransforms = {
  unifyPlaylists(playlists: ApplePlaylistsResponse): UnifiedPlaylist[];
  unifySongs(songs: AppleSongsResponse): UnifiedSong[];
};

export type AppleTokens = {
  accessToken: string;
  developerToken: string;
};

export type BuildAppleProvider = {
  provider: Provider.apple;
  tokens: AppleTokens;
};
