import bcrypt from "bcrypt"
import { userModel } from "../../database/model/users.model.js"

export const findByEmail = (email) => userModel.findOne({ email })

export const findById = (id) => userModel.findById(id).select("-password")

export const createUser = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return userModel.create({ ...data, password: hashedPassword })
}

export const loginUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email })
    if (!user) return null
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return null
    return userModel.findById(user._id).select("-password")
}

export const updateUser = (id, data) =>
    userModel.findByIdAndUpdate(id, data, { new: true }).select("-password")

export const deleteUser = (id) => userModel.findByIdAndDelete(id)