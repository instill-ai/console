import { InstillAiUserCookie } from "@/types/general";
import { NextApiRequest, NextApiResponse } from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, cookies } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const instillAiUserCookie: InstillAiUserCookie = cookies["instill-ai-user"]
    ? JSON.parse(cookies["instill-ai-user"])
    : { cookie_token: null };

  return res.status(200).json(instillAiUserCookie);
};
