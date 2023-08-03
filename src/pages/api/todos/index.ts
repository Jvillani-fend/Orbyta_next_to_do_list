import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../../../firebaseInit";
import { ToDo } from "./types/toDo.interface";

const dummyTodo = {
  id: 3,
  name: "New to do",
  state:false,
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const todoId = uuidv4();
        const { state, name, description } = req.body
        await database.ref(`todos/${todoId}`).set({
          id: todoId,
          name,
          state,
          description,
        })
        return res.status(200).json({ message: "to do added succesfully" });
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Failed to complete the request", errorDetails: e });
      }
      break;
    case "GET":
      try {
        const { order } = req.query
        const data = (await database.ref(`/todos`).once("value")).val();
        const todos: ToDo[] = Object.keys(data).map((key) => data[key]).filter((el: ToDo) => {
          switch (order) {
            case "completed":
            return (el.state === "true")
              break;
            case "to_complete":
              return (el.state === "false")
              break;
            default:
              return true
              break;
          }
        })
        return res.status(200).json({todos,message:"success"});
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Failed to complete the request", errorDetails: e });
      }
      break;
    case "DELETE":
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
