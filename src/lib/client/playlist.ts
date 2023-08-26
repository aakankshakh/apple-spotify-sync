export const getUserPlaylists = async (
  type: "spotify" | "apple",
  token: string,
  devToken: string
) => {
  return type === "spotify"
    ? getSpotifyPlaylists(token)
    : getApplePlaylists(token, devToken);
};

const getApplePlaylists = async (userToken: string, devToken: string) => {
  return fetch("https://api.music.apple.com/v1/me/library/playlists", {
    headers: {
      Authorization: `Bearer ${devToken}`,
      "Music-User-Token": userToken,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

const getSpotifyPlaylists = async (userToken: string) => {
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data.items)
    .catch((err) => console.error(err));
};
