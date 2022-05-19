import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    console.log(req.body);
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`,
      {
        email: req.body.email,
        company_name: req.body.company_name,
        role: req.body.role,
        usage_data_collection: req.body.usage_data_collection,
        newsletter_subscription: req.body.newsletter_subscription,
      }
    );
    return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(400).json(JSON.stringify(err));
  }
};

export default handler;
