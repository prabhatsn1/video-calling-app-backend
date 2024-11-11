import { StreamClient, UserRequest } from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.API_GETSTREAM_PUBLISHABLE_KEY;
const apiSecret = process.env.API_GETSTREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream API keys");
}
const client = new StreamClient(apiKey, apiSecret);

export async function POST(req: NextRequest) {
  const { userId, name, image, email } = await req.json();
  const newUser: UserRequest = {
    id: userId,
    role: "user",
    name,
    image,
    custom: { email },
  };
  await client.upsertUsers([newUser]);
  const validity = 60 * 60;
  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });
  console.log(
    `Generated token ${token} for user ${userId} with validity ${validity} seconds`
  );
  return NextResponse.json({ token });
}
