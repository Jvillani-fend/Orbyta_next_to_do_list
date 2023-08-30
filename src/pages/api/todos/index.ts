import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";


import { ToDo } from "./types/toDo.interface";
import { insertTodo } from "../mongo_service";
import { getList } from "../mongo_service";

const dummyTodo = {
  id: 3,
  name: "New to do",
  state: false,
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await insertTodo(res, req)
      break;
    case "GET":
      await getList(res, req)
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
