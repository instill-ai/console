import { InstillAiUserCookie, Nullable } from "@instill-ai/toolkit";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, cookies, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.key) {
    return res.status(500).end("Key not provided");
  }

  const targetCookie = cookies[body.key];
  let responseBody: Nullable<any> = null;

  if (targetCookie) {
    responseBody = targetCookie;
  }

  return res.status(200).json(responseBody);
};

export default handler;
