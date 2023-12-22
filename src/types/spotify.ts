import { Provider, UnifiedPlaylist, UnifiedSong } from ".";

type SpotifyObject = {
  href: string;
  id: string;
  type: string;
  uri: string;
};
export type SpotifyPlaylist = SpotifyObject & {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
};

type SpotifyAlbum = {
  album_type: string;
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

type SpotifyArtist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type SpotifySong = {
  added_at?: string;
  added_by?: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: false;
  track: SpotifyObject & {
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    external_urls: {
      spotify: string;
    };
    is_playable: boolean;
    restrictions: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url?: string;
    track_number: number;
    is_local: boolean;
  };
};

type SpotifyListResponse<T> = {
  href: string;
  items: T;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
export type SpotifyPlaylistsResponse = SpotifyListResponse<SpotifyPlaylist[]>;
export type SpotifySongsResponse = SpotifyListResponse<SpotifySong[]>;
export type SpotifyTransforms = {
  unifyPlaylists(playlists: SpotifyPlaylistsResponse): UnifiedPlaylist[];
  unifySongs(songs: SpotifySongsResponse): UnifiedSong[];
};

export type SpotifyTokens = {
  accessToken: string;
};

export type BuildSpotifyProvider = {
  provider: Provider.spotify;
  tokens: SpotifyTokens;
};
