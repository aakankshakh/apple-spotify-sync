import { Provider, UnifiedPlaylist, UnifiedSong } from "../../../types";
import {
  ApplePlaylist,
  ApplePlaylistsResponse,
  AppleSong,
  AppleSongsResponse,
  AppleTokens,
  AppleTransforms,
} from "../../../types/apple";
import { MusicProvider, PLAYLIST_PAGE_SIZE } from "./_provider";

const mapApplePlaylist = (playlist: ApplePlaylist): UnifiedPlaylist => {
  const { id, attributes } = playlist;
  const { name, artwork } = attributes;
  const imageURL = artwork?.url;
  const unifiedPlaylist = {
    id,
    name,
    imageURL,
    provider: Provider.apple,
  } as UnifiedPlaylist;

  return unifiedPlaylist;
};

const mapAppleSong = (song: AppleSong): UnifiedSong => {
  const { id, attributes } = song;
  const { name, artistName } = attributes;
  const unifiedSong = {
    artists: [artistName],
    id,
    name,
    provider: Provider.apple,
  } as UnifiedSong;

  return unifiedSong;
};

class AppleMusicProvider implements MusicProvider {
  provider = Provider.apple;
  tokens: AppleTokens;
  transforms: AppleTransforms = {
    unifyPlaylists: (playlists) => {
      const realPlaylists = playlists.data;
      return realPlaylists.map(mapApplePlaylist);
    },
    unifySongs: (songs) => {
      const realSongs = songs.data;
      return realSongs.map(mapAppleSong);
    },
  };

  constructor(tokens: AppleTokens) {
    this.tokens = tokens;
  }

  async getPlaylists(page: number = 0): Promise<UnifiedPlaylist[]> {
    const offset = PLAYLIST_PAGE_SIZE * page;
    const url = `https://api.music.apple.com/v1/me/library/playlists?extend=attributes&limit=${PLAYLIST_PAGE_SIZE}&offset=${offset}`;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tokens.developerToken}`,
        "Music-User-Token": this.tokens.accessToken,
      },
    })
      .then((res) => res.json() as Promise<ApplePlaylistsResponse>)
      .then(this.transforms.unifyPlaylists)
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  async getPlaylistSongs(
    playlistId: string,
    page: number = 0
  ): Promise<UnifiedSong[]> {
    const offset = PLAYLIST_PAGE_SIZE * page;
    const url = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks?limit=${PLAYLIST_PAGE_SIZE}&offset=${offset}`;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tokens.developerToken}`,
        "Music-User-Token": this.tokens.accessToken,
      },
    })
      .then((res) => res.json() as Promise<AppleSongsResponse>)
      .then(this.transforms.unifySongs)
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  async createPlaylist(
    name: string,
    songs: UnifiedSong[]
  ): Promise<UnifiedPlaylist> {
    throw new Error("Not implemented.");
  }

  async updatePlaylist(
    updatedPlaylist: Partial<UnifiedPlaylist>
  ): Promise<UnifiedPlaylist> {
    throw new Error("Not implemented.");
  }
}

export default AppleMusicProvider;
