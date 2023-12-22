import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseObject, playlistDBEntry, sync } from "../../types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) {
  if (req.method !== "GET") {
    res.status(405).json({
      object: "playlist",
      data: undefined,
      error: "Method not allowed",
    });
  }
}
