// import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebaseInit"
import { deleteTodo, editTodo } from "../mongo_service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const todoId = req.query.id as string
  switch (req.method) {
    case "PUT":
      await editTodo(res, req)
      break;
    case "DELETE":
      await deleteTodo(res, req)
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
