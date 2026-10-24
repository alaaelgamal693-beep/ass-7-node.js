import { Router } from "express"
import mongoose from "mongoose"
import { response } from "../../common/index.js"
import { noteModel } from "../../database/model/notes.model.js"
import * as ns from "./note.service.js"

export const noteRouter = Router()



noteRouter.get("/paginate-sort", async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const notes = await ns.findPaginated(req.query.id, page, limit)
    response({ res, message: "Notes fetched", data: notes })
})



noteRouter.get("/note-by-content", async (req, res) => {
    const note = await ns.findByContent(req.query.id, req.query.content)
    if (!note) {
        return response({ res, message: "No note found", status: 404 })
    }
    response({ res, message: "Note fetched", data: note })
})



noteRouter.get("/note-with-user", async (req, res) => {
    const notes = await ns.findWithUserEmail(req.query.id)
    response({ res, message: "Notes fetched", data: notes })
})



noteRouter.get("/aggregate", async (req, res) => {
    const match = { userId: new mongoose.Types.ObjectId(req.query.id) }
    if (req.query.title) {
        match.title = { $regex: req.query.title, $options: "i" }
    }
    const notes = await noteModel.aggregate([
        { $match: match },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { title: 1, createdAt: 1, userId: 1, "user.name": 1, "user.email": 1 } }
    ])
    response({ res, message: "Notes fetched", data: notes })
})



noteRouter.patch("/all", async (req, res) => {
    const result = await ns.updateAllTitles(req.query.id, req.body.title)
    if (result.modifiedCount === 0) {
        return response({ res, message: "No note found", status: 404 })
    }
    response({ res, message: "All notes updated" })
})



noteRouter.put("/replace/:noteId", async (req, res) => {
    const note = await ns.findNoteById(req.params.noteId)
    if (!note) {
        return response({ res, message: "Note not found", status: 404 })
    }
    if (note.userId.toString() !== req.query.id) {
        return response({ res, message: "You are not the owner", status: 403 })
    }
    const updated = await ns.replaceNote(req.params.noteId, req.body)
    response({ res, message: "replaced", data: updated })
})



noteRouter.post("/", async (req, res) => {
    await ns.createNote({ ...req.body, userId: req.query.id })
    response({ res, message: "Note created", status: 201 })
})



noteRouter.patch("/:noteId", async (req, res) => {
    const note = await ns.findNoteById(req.params.noteId)
    if (!note) {
        return response({ res, message: "Note not found", status: 404 })
    }
    if (note.userId.toString() !== req.query.id) {
        return response({ res, message: "You are not the owner", status: 403 })
    }
    const updated = await ns.updateNote(req.params.noteId, req.body)
    response({ res, message: "updated", data: updated })
})



noteRouter.delete("/", async (req, res) => {
    await ns.deleteAllNotes(req.query.id)
    response({ res, message: "Deleted" })
})



noteRouter.delete("/:noteId", async (req, res) => {
    const note = await ns.findNoteById(req.params.noteId)
    if (!note) {
        return response({ res, message: "Note not found", status: 404 })
    }
    if (note.userId.toString() !== req.query.id) {
        return response({ res, message: "You are not the owner", status: 403 })
    }
    const deleted = await ns.deleteNote(req.params.noteId)
    response({ res, message: "deleted", data: deleted })
})



noteRouter.get("/:id", async (req, res) => {
    const note = await ns.findNoteById(req.params.id)
    if (!note) {
        return response({ res, message: "Note not found", status: 404 })
    }
    if (note.userId.toString() !== req.query.id) {
        return response({ res, message: "You are not the owner", status: 403 })
    }
    response({ res, message: "Note fetched", data: note })
})