import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateGithubModelResponse } from "@/lib/instill";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body) {
    return res.status(500).json("Create github model payload not provided");
  }

  try {
    const { data } = await axios.post<CreateGithubModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
      body
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
