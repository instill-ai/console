import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ListModelInstancesResponse } from "@/lib/instill";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.name) {
    return res.status(500).json("Model name not provided");
  }

  try {
    const { data } = await axios.get<ListModelInstancesResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${body.name}/instances?view=VIEW_FULL`
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
