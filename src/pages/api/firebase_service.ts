import { NextApiRequest, NextApiResponse } from "next";
import { database } from "../../../firebaseInit";
import { v4 as uuidv4 } from "uuid";
import { ToDo } from "./todos/types/toDo.interface";
export const insertTodo = async (res: NextApiResponse, req: NextApiRequest) => {
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
}

export const editTodo = async (res: NextApiResponse, req: NextApiRequest) => {
    const todoId = req.query.id as string
    try {
        let exists: boolean = false
        await database.ref(`todos/${todoId}`).once("value", (snapshot) => { snapshot.val() !== null ? exists = true : exists = false })
        if (exists) {
            const { state, name, description } = req.body
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
            res.status(404).json({ message: "The specified to do doesn't exist" })
        }
    } catch (e) {
        res.status(500).json({ message: "there was a problem inside the request", e })
    }
}

export const deleteTodo = async (res: NextApiResponse, req: NextApiRequest) => {
    const todoId = req.query.id as string
    try {
        await database.ref(`todos/${todoId}`).remove()
        res.status(200).json({ message: "to do removed successfully" })
    } catch (e) {
        res.status(500).json({ message: "there was a problem inside the request", e })
    }
}

export const getList = async (res: NextApiResponse, req: NextApiRequest) => {
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
        return res.status(200).json({ todos, message: "success" });
    } catch (e) {
        return res
            .status(500)
            .json({ error: "Failed to complete the request", errorDetails: e });
    }
}
