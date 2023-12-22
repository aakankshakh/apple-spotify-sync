import {
  ProviderTokens,
  ProviderTransforms,
  Provider,
  UnifiedPlaylist,
  UnifiedSong,
} from "../../../types";

export const PLAYLIST_PAGE_SIZE = 25;
export const SONG_PAGE_SIZE = 100;

export interface MusicProvider {
  provider: Provider;
  tokens: ProviderTokens;
  transforms: ProviderTransforms;
  getPlaylists(page?: number): Promise<UnifiedPlaylist[]>;
  getPlaylistSongs(playlistId: string, page?: number): Promise<UnifiedSong[]>;
  createPlaylist(name: string, songs: UnifiedSong[]): Promise<UnifiedPlaylist>;
  updatePlaylist(
    updatedPlaylist: Partial<UnifiedPlaylist>
  ): Promise<UnifiedPlaylist>;
}
