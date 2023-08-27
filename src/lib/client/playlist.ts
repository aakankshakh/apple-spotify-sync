import { Platform, UnifiedPlaylist, UnifiedSong } from "@/types";

export const getUserPlaylists = async (
  type: Platform,
  token: string,
  devToken: string
) => {
  return type === "spotify"
    ? getSpotifyPlaylists(token)
    : getApplePlaylists(token, devToken);
};

type ApplePlaylist = {
  id: string;
  type: string;
  href: string;
  attributes: {
    lastModifiedDate: string;
    canEdit: boolean;
    name: string;
    isPublic: boolean;
    hasCatalog: boolean;
    dateAdded: string;
    playParams: {
      id: string;
      kind: string;
      isLibrary: boolean;
      globalId: string;
    };
    artwork?: {
      width: number | null;
      height: number | null;
      url: string;
    };
  };
};
type ApplePlaylists = {
  next: string;
  data: ApplePlaylist[];
  meta: {
    total: number;
  };
};
const transformApplePlaylists = (
  playlists: ApplePlaylist[]
): UnifiedPlaylist[] => {
  playlists.sort((a, b) => {
    let dateA = new Date(a.attributes.lastModifiedDate);
    let dateB = new Date(b.attributes.lastModifiedDate);
    return dateA.getTime() - dateB.getTime();
  });
  return playlists.map((playlist) => {
    const transformedPlaylist: UnifiedPlaylist = {
      id: playlist.id,
      imageURL: playlist.attributes.artwork
        ? playlist.attributes.artwork.url
        : undefined,
      name: playlist.attributes.name,
      type: "apple",
    };
    return transformedPlaylist;
  });
};
const getApplePlaylists = async (
  userToken: string,
  devToken: string
): Promise<UnifiedPlaylist[]> => {
  return fetch(
    `https://api.music.apple.com/v1/me/library/playlists?extend=attributes`,
    {
      headers: {
        Authorization: `Bearer ${devToken}`,
        "Music-User-Token": userToken,
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json as ApplePlaylists)
    .then((data) => data.data)
    .then((playlists) => transformApplePlaylists(playlists))
    .catch((err) => {
      console.error(err);
      return [];
    });
};

type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
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
  type: string;
  uri: string;
};
const transformSpotifyPlaylists = (
  playlists: SpotifyPlaylist[]
): UnifiedPlaylist[] => {
  return playlists.map((playlist: SpotifyPlaylist) => {
    const transformedPlaylist: UnifiedPlaylist = {
      id: playlist.id,
      imageURL: playlist.images.length > 0 ? playlist.images[0].url : undefined,
      name: playlist.name,
      type: "spotify",
    };

    return transformedPlaylist;
  });
};
const getSpotifyPlaylists = async (
  userToken: string,
  page: number = 0
): Promise<UnifiedPlaylist[]> => {
  const per_page = 50;
  const composed_url = `https://api.spotify.com/v1/me/playlists?offset=${
    50 * page
  }&limit=${per_page}`;

  return fetch(composed_url, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data.items)
    .then((playlists) => transformSpotifyPlaylists(playlists))
    .catch((err) => {
      console.error(err);
      return [];
    });
};
