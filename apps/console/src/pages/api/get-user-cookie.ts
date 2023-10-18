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

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let responseBody: null | any = null;

  if (targetCookie) {
    responseBody = targetCookie;
  }

  return res.status(200).json(responseBody);
};

export default handler;
