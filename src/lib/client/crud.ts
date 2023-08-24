import { ResponseObject, WithOptional, playlist } from "@/types";

export const createPlaylist = async (
  playlistData: WithOptional<playlist, "id">,
  onError: (err: string) => void,
  onSuccess: (playlist: playlist) => void
) => {
  const res = await fetch("/api/playlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playlistData),
  });
  const data = (await res.json()) as ResponseObject;

  if (data.error !== undefined) {
    onError(data.error);
  } else if (data.object !== "playlist") {
    onError("Received non-playlist object");
  } else {
    onSuccess(data.data);
  }
};

export const getPlaylist = async (
  id: string,
  onError: (err: string) => void,
  onSuccess: (playlist: playlist) => void
) => {
  const res = await fetch(`/api/playlist?id=${id}`);
  const data = (await res.json()) as ResponseObject;
  console.log("received data:", data);

  if (data.error !== undefined) {
    onError(data.error);
  } else if (data.object !== "playlist") {
    onError("Received non-playlist object");
  } else {
    onSuccess(data.data);
  }
};

export const createTest = async () => {
  createPlaylist(
    {
      name: "Test playlist",
      songs: [
        {
          name: "Washing Machine Heart",
          artist: "Mitski",
          duration: 128,
        },
        {
          name: "The Less I Know The Better",
          artist: "Tame Impala",
          duration: 167,
        },
        {
          name: "Freaking Out The Neighborhood",
          artist: "Mac DeMarco",
          duration: 218,
        },
      ],
      owner_id: "calum",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: undefined,
    },
    (err) => console.log(err),
    (playlist) => console.log(playlist)
  );
};
