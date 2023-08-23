export type playlist = {
  id: string;
  name: string;
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

export type ResponseObj = {
  object: "playlist" | "song" | "sync";
  data: playlist | song | sync | undefined;
  error: string | undefined;
};
