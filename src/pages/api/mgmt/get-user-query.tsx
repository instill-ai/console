import { GetUserResponse } from "@/lib/instill/mgmt";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.id) {
    return res.status(500).json("User id not provided");
  }

  try {
    const response = await axios.get<GetUserResponse>(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/users/${body.id}`
    );

    return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
