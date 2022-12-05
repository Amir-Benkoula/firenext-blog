// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
type Data = {
  imageUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await axios
    .post(
      "https://stable-diffusion-nodejs-api-production.up.railway.app/text-to-image",
      { prompt: req.body }
    )
    .then((response) => {
      res.status(200).json({ imageUrl: response.data });
    })
    .catch(() => {
      res.errored;
    });
}
