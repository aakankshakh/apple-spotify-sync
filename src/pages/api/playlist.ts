import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  updatePlaylist,
} from "@/lib/server/crud";
import { ResponseObject, playlistDBEntry } from "../../types/index";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

/**
 * Handle CRUD requests to /api/playlist as follows:
 *
 * POST: Create a new playlist in the database
 *
 * GET: Retrieve an existing playlist from the database
 *
 * PUT: Update an existing playlist in the database
 *
 * DELETE: Soft delete an existing playlist in the database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) {
  if (req.method === "GET") {
    await get(req, res);
  } else if (req.method === "POST") {
    await post(req, res);
  } else if (req.method === "PUT") {
    await put(req, res);
  } else if (req.method === "DELETE") {
    await del(req, res);
  } else {
    res.status(405).json({
      object: "playlist",
      data: undefined,
      error: "Method not allowed.",
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
  const status = playlistData.error !== undefined ? 200 : 500;
  res.status(status).json(playlistData);
};

/**
 * Create a new playlist in the database
 */
const post = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({
      object: "playlist",
      data: undefined,
      error: "Unauthorized",
    });
    return;
  }

  const { playlist } = req.body;
  console.log("playlist:", playlist);

  const playlistData: playlistDBEntry = {
    id: uuidv4(), // Force a new id
    playlist: playlist,
    owner_id: session.id,
    created_at: new Date(),
    deleted_at: undefined,
    updated_at: undefined,
  };

  const createPlaylistRes = await createPlaylist(playlistData);
  console.log("createPlaylistRes:", createPlaylistRes);
  const status = createPlaylistRes.error !== undefined ? 200 : 500;
  res.status(status).json(createPlaylistRes);
};

/**
 * Update an existing playlist in the database
 */
const put = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({
      object: "playlist",
      data: undefined,
      error: "Unauthorized",
    });
    return;
  }
  const { id: user_id } = session;

  const updatedPlaylistData: Partial<playlistDBEntry> & {
    id: string;
    owner_id: string;
  } = req.body;

  if (updatedPlaylistData.owner_id !== user_id) {
    res.status(401).json({
      object: "playlist",
      data: undefined,
      error: "Unauthorized",
    });
    return;
  }

  const updatePlaylistRes = await updatePlaylist(
    updatedPlaylistData.id,
    updatedPlaylistData
  );
  const status = updatePlaylistRes.error !== undefined ? 200 : 500;
  res.status(status).json(updatePlaylistRes);
};

/**
 * Soft delete an existing playlist in the database
 */
const del = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({
      object: "playlist",
      data: undefined,
      error: "Unauthorized",
    });
    return;
  }
  const { id: user_id } = session;

  const { id } = req.query;
  if (id !== user_id) {
    res.status(401).json({
      object: "playlist",
      data: undefined,
      error: "Unauthorized",
    });
    return;
  }

  const deletePlaylistRes = await deletePlaylist(id as string);
  const status = deletePlaylistRes.error !== undefined ? 200 : 500;
  res.status(status).json(deletePlaylistRes);
};
