import {
  ResponseObject,
  UnifiedPlaylist,
  WithOptional,
  playlistDBEntry,
  sync,
} from "@/types";

export const createPlaylist = async (
  playlistData: Pick<playlistDBEntry, "playlist">,
  onError: (err: string) => void,
  onSuccess: (playlist: playlistDBEntry) => void
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
  onSuccess: (playlist: playlistDBEntry) => void
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

export const createSync = async (
  syncData: sync,
  onError: (err: string) => void,
  onSuccess: () => void
) => {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(syncData),
  });
  const data = (await res.json()) as ResponseObject;

  if (data.error !== undefined) {
    onError(data.error);
  } else if (data.object !== "sync") {
    onError("Received non-sync object");
  } else {
    onSuccess();
  }
};
