import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ListSourceDefinitionsResponse } from "@/lib/instill";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { data } = await axios.get<ListSourceDefinitionsResponse>(
      `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/destination-connectors?view=VIEW_FULL`
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
