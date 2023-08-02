import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../../../firebaseInit";

const dummyTodo = {
  id: 3,
  name: "New to do",
  status: false,
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const todoId = uuidv4();
        // const todoData = { id: todoId, ...req.body };
        const { status, name, description } = req.body
        await database.ref(`todos/${todoId}`).set({
          id: todoId,
          name,
          status,
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
        const todos = await axios.get(
          "https://to-do-list-next-default-rtdb.europe-west1.firebasedatabase.app/todos.json"
        );
        return res.status(200).json(todos.data);
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Failed to complete the request", errorDetails: e });
      }
      break;
    case "DELETE":
      break;
    case "PUT":
      try {
        const todos = await axios.put(
          "https://to-do-list-next-default-rtdb.europe-west1.firebasedatabase.app/todos.json"
        );
      } catch (e) {

      }
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
