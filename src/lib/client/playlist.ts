import { song } from "@/types";

type Platform = "apple" | "spotify";
export type UnifiedSong = {
  artists: string[];
  id: string;
  name: string;
  type: Platform;
};
export type UnifiedPlaylist = {
  id: string;
  imageURL: string;
  name: string;
  tracks?: song[];
  type: Platform;
};
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
  next: string;
  data: {
    id: string;
    type: "library-playlists";
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
        kind: "playlist";
        isLibrary: boolean;
        globalId: string;
      };
    };
  }[];
  meta: {
    total: number;
  };
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
    .then((data) => data.data)
    .then((playlists: ApplePlaylist[]) => {
      playlists.map((playlist) => {
        console.log(playlist);
      });
    })
    .catch((err) => console.error(err));
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
const getSpotifyPlaylists = async (
  userToken: string,
  page: number = 0
): Promise<UnifiedPlaylist[]> => {
  const per_page = 50;
  const composed_url = `https://api.spotify.com/v1/me/playlists?offset=${
    50 * page
  }&limit=${per_page}`;
  const fields = encodeURI(
    "items(added_at,track(id, artists(name), duration_ms, name))"
  );

  return fetch(composed_url, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data.items)
    .then((playlists) =>
      playlists.map((playlist: SpotifyPlaylist) =>
        fetch(`${playlist.tracks.href}?fields=${fields}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const transformedPlaylist: UnifiedPlaylist = {
              id: playlist.id,
              imageURL: playlist.images[0].url,
              songs: data.items.map((item) => {
                const transformedSong: UnifiedSong = {
                  id: item.track.id,
                  name: item.track.name,
                  artists: item.track.artists.map((artist: any) => {
                    return artist.name;
                  }),
                  duration_ms: item.track.duration_ms,
                };
              }),
            };

            return newPlaylist;
          })
      )
    )
    .catch((err) => console.error(err));
};
