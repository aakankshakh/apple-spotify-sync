export type playlist = {
  id: string;
  name: string;
  songs: song[];
  created_at: Date | undefined;
  deleted_at: Date | undefined;
  updated_at: Date | undefined;
};
export type song = {
  name: string;
  artist: string;
  error: string | undefined;
};
export type sync = {
  user_one: string;
  user_two: string;
  playlist_id: string;
  playlist_one: string;
  playlist_two: string;
  created_at: Date | undefined;
};

type playlistRespone = {
  object: "playlist";
  data: playlist;
  error: undefined;
};
type songResponse = {
  object: "song";
  data: song;
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
export type ResponseObject =
  | playlistRespone
  | songResponse
  | syncResponse
  | errorResponse;
