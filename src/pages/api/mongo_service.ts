import { MongoClient } from "mongodb";
import { MONGODBTODOS } from "../../../const";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Cors from "cors"
export const connectDB = async () => {
    const client = await MongoClient.connect(MONGODBTODOS)
    return client;
}

const cors = Cors({
    origin: 'http://localhost:4200', // Replace with your Angular app's URL
    methods: ['GET', 'POST',"PUT","PATCH","DELETE"], // Specify allowed HTTP methods
  });

export const insertTodo = async (res: NextApiResponse, req: NextApiRequest) => {
    let client;
    try {
        const todoId = uuidv4();
        const { name, state, description } = req.body
        client = await connectDB()
        const db = client.db()
        const result = await db.collection("todos").insertOne({ id: todoId, ...req.body })
        client.close()
        return res.status(200).json({ message: "to do added succesfully" });
    } catch (e) {
        client && client.close()
        return res
            .status(500)
            .json({ error: "Failed to complete the request", errorDetails: e });
    }

}

export const editTodo = async (res: NextApiResponse, req: NextApiRequest) => {
    const todoId = req.query.id as string
    let client
    try {
        let exists: boolean = false
        client = await connectDB()
        const db = client.db()
        exists = await db.collection("todos").findOne({ id: todoId }) ? true : false
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
            await db.collection("todos").updateOne({ id: todoId }, { $set: updates })
            client.close()
            return res.status(200).json({ message: "Todo updated successfully" })
        } else {
            client.close()
            return res.status(404).json({ message: "The specified to do doesn't exist" })
        }
    } catch (e) {
        client && client.close()
        return res.status(500).json({ message: "there was a problem inside the request", e })
    }
}


export const deleteTodo = async (res: NextApiResponse, req: NextApiRequest) => {
    const todoId = req.query.id as string
    let client;
    try {
        client = await connectDB()
        const db = client.db()
        const exists = await db.collection("todos").findOne({ id: todoId }) ? true : false
        if (exists) {
            const removeItem = await db.collection("todos").deleteOne({ id: todoId })
            client.close()
            return res.status(200).json({ message: "to do removed successfully" })
        } else {
            client.close()
            return res.status(404).json({ message: "Item not found" })
        }

    } catch (e) {
        return res.status(500).json({ message: "there was a problem inside the request", e })
    }
}

export const getList = async (res: NextApiResponse, req: NextApiRequest) => {
    cors(req,res,()=>{console.log("ok")})
    let client = null;
    try {
        const { order } = req.query
        client = await connectDB()
        const db = client.db()
        const collection = db.collection("todos")
        let todos;
        switch (order) {
            case "completed":
                todos = await collection.find({ state: true }).toArray()
                break;
            case "to_complete":
                todos = await collection.find({ state: false }).toArray()
                break;
            default:
                todos = collection.find({}).toArray()
                break;    
        }
        client.close()
        return res.status(200).json({ todos: todos, message: "success" });

    } catch (e) {
        client && client.close()
        return res
            .status(500)
            .json({ error: "Failed to complete the request", errorDetails: e });
    }
}


export const deleteCompleted = async (res: NextApiResponse, req: NextApiRequest) => {
    let client;
    try {
        const deleteOperations: any = {};
        const allToDos = await axios.get("http://localhost:3000/api/todos")
        client = await connectDB()
        const db = client.db()
        const collection = db.collection("todos")
        await collection.deleteMany({ state: true })
        client.close()
        res.status(200).json({ message: "Completed tasks removed" })
    } catch (e) {
        client && client.close()
        res.status(500).json({ message: "There was an error deleting completed tasks", errorInfo: e })
    }
}