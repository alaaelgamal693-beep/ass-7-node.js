import { noteModel } from "../../database/model/notes.model.js"

export const createNote = (data) => noteModel.create(data)

export const findNoteById = (id) => noteModel.findById(id)

export const updateNote = (id, data) =>
    noteModel.findByIdAndUpdate(id, data, { new: true })

export const replaceNote = (id, data) =>
    noteModel.findOneAndReplace({ _id: id }, data, { new: true })

export const updateAllTitles = (userId, title) =>
    noteModel.updateMany({ userId }, { title })

export const deleteNote = (id) => noteModel.findByIdAndDelete(id)

export const deleteAllNotes = (userId) => noteModel.deleteMany({ userId })

export const findPaginated = (userId, page, limit) =>
    noteModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

export const findByContent = (userId, content) =>
    noteModel.findOne({ userId, content })

export const findWithUserEmail = (userId) =>
    noteModel.find({ userId })
        .select("title userId createdAt")
        .populate("userId", "email")