import { kv } from "@vercel/kv";
import { playlistDBEntry, ResponseObject, sync } from "@/types";

const errRes = (
  error: string,
  object: "playlist" | "sync" | "song"
): ResponseObject => {
  return {
    object,
    data: undefined,
    error: "Error: " + error,
  };
};
const falseRes = (error: string): ResponseObject => {
  return {
    object: "boolean",
    success: false,
    error: "Error: " + error,
  };
};
const trueRes = (): ResponseObject => {
  return {
    object: "boolean",
    success: true,
    error: undefined,
  };
};

export async function createPlaylist(
  playlist: playlistDBEntry
): Promise<ResponseObject> {
  try {
    await kv.set(`playlist:${playlist.id}`, playlist);
    return {
      object: "playlist",
      data: playlist,
      error: undefined,
    };
  } catch (error: any) {
    return errRes(error, "playlist");
  }
}

/**
 * Retrieve an existing playlist from the database
 */
export async function getPlaylist(id: string): Promise<ResponseObject> {
  try {
    const playlistData = await kv.get<playlistDBEntry>(`playlist:${id}`);
    if (!playlistData) {
      return errRes("Playlist not found", "playlist");
    }

    return {
      object: "playlist",
      data: playlistData,
      error: undefined,
    };
  } catch (error) {
    return errRes(error as string, "playlist");
  }
}

/**
 * Update a playlist by merging the modified properties with the current playlist.
 */
export async function updatePlaylist(
  id: string,
  updatedPlaylist: Partial<playlistDBEntry>
): Promise<ResponseObject> {
  try {
    const currentPlaylistRes = (await getPlaylist(id)) as ResponseObject & {
      object: "playlist";
    };
    if (currentPlaylistRes.error !== undefined) {
      return errRes(currentPlaylistRes.error, "playlist");
    }
    const currentPlaylist = currentPlaylistRes.data;

    const newPlaylist = {
      ...currentPlaylist,
      ...updatedPlaylist,
    } as playlistDBEntry;
    await kv.set(`playlist:${id}`, newPlaylist);

    return {
      object: "playlist",
      data: newPlaylist,
      error: undefined,
    };
  } catch (error) {
    return errRes(error as string, "playlist");
  }
}

/**
 * Soft delete a playlist by setting the deleted_at field to the current date.
 */
export async function deletePlaylist(id: string): Promise<ResponseObject> {
  try {
    const today = new Date();
    const playlist = await getPlaylist(id);
    if (playlist.error) {
      return falseRes(playlist.error);
    }

    const newPlaylist = { ...playlist, deleted_at: today };
    await kv.set(`playlist:${id}`, newPlaylist);
    return trueRes();
  } catch (error) {
    return errRes(error as string, "playlist");
  }
}

/**
 * Create a new sync in the database
 */
export async function createSync(sync: sync): Promise<ResponseObject> {
  try {
    await kv.set(`sync:${sync.playlist_id}`, sync);
    return {
      object: "sync",
      data: sync,
      error: undefined,
    };
  } catch (error) {
    return errRes(error as string, "sync");
  }
}

/**
 * Retrieve an existing sync from the database
 */
export async function getSync(playlist_id: string): Promise<ResponseObject> {
  try {
    const syncData = await kv.get<sync>(`sync:${playlist_id}`);
    if (!syncData) {
      return errRes("Sync not found", "sync");
    }

    return {
      object: "sync",
      data: syncData,
      error: undefined,
    };
  } catch (error) {
    return errRes(error as string, "sync");
  }
}

/**
 * Update a sync by merging the modified properties with the current sync.
 */
export async function updateSync(
  playlist_id: string,
  updatedSync: Partial<sync>
): Promise<ResponseObject> {
  try {
    const currentSyncRes = (await getSync(playlist_id)) as ResponseObject & {
      object: "sync";
    };
    if (currentSyncRes.error !== undefined) {
      return errRes("Sync not found", "sync");
    }

    const newSync = { ...currentSyncRes.data, ...updatedSync } as sync;
    await kv.set(`sync:${playlist_id}`, newSync);

    return {
      object: "sync",
      data: newSync,
      error: undefined,
    };
  } catch (error) {
    return errRes(error as string, "sync");
  }
}

/**
 * Soft delete a sync by setting the deleted_at field to the current date.
 */
export async function deleteSync(playlist_id: string): Promise<ResponseObject> {
  try {
    const today = new Date();
    const sync = await getSync(playlist_id);
    if (sync.error) {
      return falseRes(sync.error);
    }

    const newSync = { ...sync, deleted_at: today };
    await kv.set(`sync:${playlist_id}`, newSync);
    return trueRes();
  } catch (error) {
    return falseRes(error as string);
  }
}
