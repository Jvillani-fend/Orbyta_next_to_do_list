// import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebaseInit"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const todoId = req.query.id as string
  switch (req.method) {
    case "PUT":
      try {
        let exists:boolean = false
        await database.ref(`todos/${todoId}`).once("value", (snapshot) => {snapshot.val() !== null ? exists = true : exists= false})
        if (exists) {
          const {state, name, description } = req.body
          const updates: any = {}; // An empty object to store the updates

          if (state !== undefined && state !== "") {
            updates["state"] = state;
          }
          if (name !== undefined && name !== "") {
            updates["name"] = name;
          }
          if (description !== undefined && description !== "") {
            updates["description"] = description;
          }
          await database.ref(`todos/${todoId}`).update(updates)
          res.status(200).json({ message: "Todo updated" })
        } else {
          res.status(404).json({message:"The specified to do doesn't exist"})
        }
      } catch (e) {
        res.status(500).json({ message: "there was a problem inside the request", e })
      }
      break;
    case "DELETE":
      try {
        await database.ref(`todos/${todoId}`).remove()
        res.status(200).json({ message: "to do removed successfully" })
      } catch (e) {
        res.status(500).json({ message: "there was a problem inside the request", e })
      }
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
}
