import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { createPlaylist, getPlaylist } from "@/lib/server/crud";
import { ResponseObject, playlist } from "@/types";

/**
 * Handle requests to /api/playlist as follows:
 *
 * GET: Retrieve an existing playlist from the database
 *
 * POST: Create a new playlist in the database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) {
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await post(req, res);
  } else {
    res.status(405).json({
      object: "playlist",
      data: undefined,
      error: "Method not allowed",
    });
  }
}

/**
 * Retrieve an existing playlist from the database
 */
const get = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) => {
  const { id } = req.query;
  const playlistData = await getPlaylist(id as string);
  if (playlistData) {
    res
      .status(200)
      .json({ object: "playlist", data: playlistData, error: undefined });
  } else {
    res.status(404).json({
      object: "playlist",
      data: undefined,
      error: `Playlist:${id} not found`,
    });
  }
};

/**
 * Create a new playlist in the database
 */
const post = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) => {
  const playlistData: playlist = {
    ...req.body,
    id: uuidv4(), // Force a new id
  };

  await createPlaylist(playlistData);
  res
    .status(200)
    .json({ object: "playlist", data: playlistData, error: undefined });
};
