import { NextApiRequest, NextApiResponse } from "next";
import { deleteCompleted } from "../mongo_service";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await deleteCompleted(res,req)
}