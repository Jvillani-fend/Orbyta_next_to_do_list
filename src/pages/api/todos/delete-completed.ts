import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../../firebaseInit";
import axios from "axios";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const deleteOperations: any = {};
        const allToDos = await axios.get("http://localhost:3000/api/todos")
        const done = Object.keys(allToDos.data).map((key) => allToDos.data[key]).filter((el: any) =>
            el.state
        )
        if (!done.length) {
            res.status(404).json({ message: "No completed task founded" })
            return
        }


        done.forEach((el: any) => {
            deleteOperations[`todos/${el.id}`] = null
        })
        res.status(200).json({ message: "Completed tasks removed" })
        await database.ref().update(deleteOperations)
    } catch (e) {
        res.status(500).json({ message: "There was an error deleting completed tasks", errorInfo: e })
    }
}