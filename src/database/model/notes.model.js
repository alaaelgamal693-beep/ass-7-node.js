import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {

        validator: (v) => v !== v.toUpperCase() || !/[A-Za-z]/.test(v),
        message: "Title cannot be entirely uppercase"
    }
},
    content: { type: String, required: true },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true })

export const noteModel = mongoose.model("Note", noteSchema)