export type Platform = "apple" | "spotify";
export type UnifiedSong = {
  artists: string[];
  id: string;
  name: string;
  type: Platform;
};
export type UnifiedPlaylist = {
  id: string;
  imageURL?: string;
  name: string;
  songs?: song[];
  type: Platform;
};

export type playlist = {
  id: string;
  name: string;
  songs: song[];
  owner_id: string;
  created_at: Date | undefined;
  deleted_at: Date | undefined;
  updated_at: Date | undefined;
};
export type song = {
  albumImage: string;
  name: string;
  artist: string;
  duration: number; //in seconds
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
export type CreatePlaylist = Omit<Partial<playlist>, "id">;
export type UpdatePlaylist = Omit<Partial<playlist>, "id">;
export type CreateSync = sync;
// only include deleted_at
export type UpdateSync = WithOptional<sync, "user_one" | "user_two">;

type playlistRespone = {
  object: "playlist";
  data: playlist;
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
export type ResponseObject = playlistRespone | syncResponse | errorResponse;
