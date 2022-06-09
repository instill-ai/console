import { InstillAiUserCookie } from "@/types/general";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, cookies } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const instillAiUserCookie: InstillAiUserCookie = JSON.parse(
    cookies["instill-ai-user"]
  );

  return res.status(200).json({
    status: "ok",
    token: instillAiUserCookie,
  });
};

export default handler;
