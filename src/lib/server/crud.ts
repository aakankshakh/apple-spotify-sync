import { kv } from "@vercel/kv";
import { playlist, sync } from "@/types";

export async function createPlaylist(playlist: playlist): Promise<void> {
  try {
    const rowCount = await kv.set(`playlist:${playlist.id}`, playlist);
    console.log(`Inserted ${rowCount} row(s)`);
  } catch (error) {
    // Handle errors
  }
}

/**
 * Retrieve an existing playlist from the database
 */
export async function getPlaylist(id: string): Promise<playlist | null> {
  try {
    const playlistData: playlist | null | undefined = await kv.get(
      `playlist:${id}`
    );
    return playlistData ? JSON.parse(JSON.stringify(playlistData)) : null;
  } catch (error) {
    // Handle errors
    return null;
  }
}

/**
 * Soft delete a playlist by setting the deleted_at field to the current date.
 */
export async function deletePlaylist(id: string): Promise<void> {
  try {
    const today = new Date();
    const playlist = await getPlaylist(id);
    if (playlist) {
      const newPlaylist = { ...playlist, deleted_at: today };
      await kv.set(`playlist:${id}`, newPlaylist);
    }
  } catch (error) {
    // Handle errors
  }
}

/**
 * Update a playlist by merging the modified properties with the current playlist.
 */
export async function updatePlaylist(
  id: string,
  updatedPlaylist: Partial<playlist>
): Promise<void> {
  try {
    const currentPlaylist = await getPlaylist(id);
    if (currentPlaylist) {
      const newPlaylist = { ...currentPlaylist, ...updatedPlaylist };
      await kv.set(`playlist:${id}`, newPlaylist);
    }
  } catch (error) {
    // Handle errors
  }
}

/**
 * Create a new sync in the database
 */
export async function createSync(sync: sync): Promise<void> {
  try {
    await kv.set(`sync:${sync.playlist_id}`, sync);
  } catch (error) {
    // Handle errors
  }
}

/**
 * Soft delete a sync by setting the deleted_at field to the current date.
 */
export async function deleteSync(playlist_id: string): Promise<void> {
  try {
    const today = new Date();
    const sync = await getSync(playlist_id);
    if (sync) {
      const newSync = { ...sync, deleted_at: today };
      await kv.set(`sync:${playlist_id}`, newSync);
    }
  } catch (error) {
    // Handle errors
  }
}

/**
 * Update a sync by merging the modified properties with the current sync.
 */
export async function updateSync(
  playlist_id: string,
  updatedSync: Partial<sync>
): Promise<void> {
  try {
    const currentSync = await getSync(playlist_id);
    if (currentSync) {
      const newSync = { ...currentSync, ...updatedSync };
      await kv.set(`sync:${playlist_id}`, newSync);
    }
  } catch (error) {
    // Handle errors
  }
}

/**
 * Retrieve an existing sync from the database
 */
export async function getSync(playlist_id: string): Promise<sync | null> {
  try {
    const syncData = await kv.get(`sync:${playlist_id}`);
    return syncData ? JSON.parse(JSON.stringify(syncData)) : null;
  } catch (error) {
    // Handle errors
    return null;
  }
}
