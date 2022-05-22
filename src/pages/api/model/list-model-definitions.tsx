import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ListModelDefinitionsResponse } from "@/lib/instill";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { data } = await axios.get<ListModelDefinitionsResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/model-definitions`
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
