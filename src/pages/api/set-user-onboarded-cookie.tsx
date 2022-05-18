import { setCookie } from "@/lib/cookie";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  setCookie(res, "true", "instill-ai-user-onboarded", 60 * 60 * 24 * 30);

  return res.status(200).json({
    status: "ok",
  });
};

export default handler;
