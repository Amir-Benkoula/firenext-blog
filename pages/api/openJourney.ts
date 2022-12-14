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
    await axios({
      method: 'post',
      url: 'https://stable-diffusion-nodejs-api-production.up.railway.app/text-to-image',
      timeout: 12 * 1000,
      data: { prompt: req.body }
    }).then((response) => {
      res.status(200).json({ imageUrl: response.data });
    })    .catch((err) => {
      console.error(err);
    });
}
