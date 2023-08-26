import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { Secret } from "jsonwebtoken";

const APPLE_PRIVATE_KEY =
  process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
if (APPLE_PRIVATE_KEY === "") {
  throw new Error("Missing APPLE_PRIVATE_KEY");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
  }

  // Issue a new JWT for our apple musickit integration
  const token = await getAppleMusicToken();
  res.status(200).json({ token });
}

async function getAppleMusicToken() {
  if (APPLE_PRIVATE_KEY === "") {
    throw new Error("Missing APPLE_PRIVATE_KEY");
  }

  const teamId = "46VU749B4W";
  const keyId = "694MU9F56C";
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 15777000,
  };
  const header = {
    alg: "ES256",
    kid: keyId,
  };

  return jwt.sign(payload, APPLE_PRIVATE_KEY, {
    algorithm: "ES256",
    header,
  });
}
