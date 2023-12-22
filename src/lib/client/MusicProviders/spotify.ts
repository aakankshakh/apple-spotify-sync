import { Provider, UnifiedPlaylist, UnifiedSong } from "../../../types";
import {
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
  SpotifySong,
  SpotifySongsResponse,
  SpotifyTokens,
  SpotifyTransforms,
} from "../../../types/spotify";
import { MusicProvider, PLAYLIST_PAGE_SIZE } from "./_provider";

const mapSpotifyPlaylist = (playlist: SpotifyPlaylist): UnifiedPlaylist => {
  const { id, name, images } = playlist;
  let imageURL: string | undefined = undefined;
  if (images.length > 0) {
    imageURL = images[0]?.url;
  }

  const unifiedPlaylist = {
    id,
    name,
    imageURL,
    provider: Provider.spotify,
  } as UnifiedPlaylist;

  return unifiedPlaylist;
};

const mapSpotifySong = (song: SpotifySong): UnifiedSong => {
  const { id, name, artists } = song.track;
  const artistNames = artists.map((artist) => artist.name);
  const unifiedSong = {
    artists: artistNames,
    id,
    name,
    provider: Provider.spotify,
  } as UnifiedSong;

  return unifiedSong;
};

class SpotifyMusicProvider implements MusicProvider {
  provider = Provider.spotify;
  tokens: SpotifyTokens;
  transforms: SpotifyTransforms = {
    unifyPlaylists: (playlists) => {
      const realPlaylists = playlists.items;
      return realPlaylists.map(mapSpotifyPlaylist);
    },
    unifySongs: (songs) => {
      const realSongs = songs.items;
      return realSongs.map(mapSpotifySong);
    },
  };

  constructor(tokens: SpotifyTokens) {
    this.tokens = tokens;
  }

  async getPlaylists(page: number = 0): Promise<UnifiedPlaylist[]> {
    const offset = PLAYLIST_PAGE_SIZE * page;
    const url = `https://api.spotify.com/v1/me/playlists?limit=${PLAYLIST_PAGE_SIZE}&offset=${offset}`;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    })
      .then((res) => res.json() as Promise<SpotifyPlaylistsResponse>)
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
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${PLAYLIST_PAGE_SIZE}&offset=${offset}`;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      },
    })
      .then((res) => res.json() as Promise<SpotifySongsResponse>)
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

export default SpotifyMusicProvider;
