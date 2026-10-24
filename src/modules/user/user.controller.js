import { Router } from "express"
import { response } from "../../common/index.js"
import * as us from "./user.service.js"

export const userRouter = Router()



userRouter.post("/signup", async (req, res) => {
    const exists = await us.findByEmail(req.body.email)
    if (exists) {
        return response({ res, message: "Email already exists.", status: 409 })
    }
    await us.createUser(req.body)
    response({ res, message: "User added successfully.", status: 201 })
})



userRouter.post("/login", async (req, res) => {
    const user = await us.loginUser(req.body)
    if (!user) {
        return response({ res, message: "Invalid email or password", status: 401 })
    }
    response({ res, message: "Login successful", data: user })
})



userRouter.patch("/:id", async (req, res) => {
    const id = req.query.id
    const { password, _id, ...data } = req.body

    if (data.email) {
        const exists = await us.findByEmail(data.email)
        if (exists && exists._id.toString() !== id) {
        return response({ res, message: "Email already exists.", status: 409 })
        }
    }

    const user = await us.updateUser(id, data)
    if (!user) {
        return response({ res, message: "User not found", status: 404 })
    }
    response({ res, message: "User updated", data: user })
})



userRouter.delete("/", async (req, res) => {
    const user = await us.deleteUser(req.query.id)
    if (!user) {
        return response({ res, message: "User not found", status: 404 })
    }
    response({ res, message: "User deleted" })
})


userRouter.get("/", async (req, res) => {
    const user = await us.findById(req.query.id)
    if (!user) {
        return response({ res, message: "User not found", status: 404 })
    }
    response({ res, message: "User fetched", data: user })
})