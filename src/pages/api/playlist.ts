// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseObj } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseObj>
) {
  res
    .status(200)
    .json({ object: "playlist", data: undefined, error: "not implemented" });
}
