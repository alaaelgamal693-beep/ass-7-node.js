import express from "express"
import configService from "./src/config/config.service.js"
import { errorHandler } from "./src/common/index.js"
import { DBconnect } from "./src/database/connection.js"
import { userRouter } from "./src/modules/user/user.controller.js"
import { noteRouter } from "./src/modules/note/note.controller.js"

const PORT = configService.port
const app = express()

await DBconnect()

app.use(express.json())

app.get("/", (req, res) => res.send("Hello World"))
app.use("/users", userRouter)
app.use("/notes", noteRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        route: req.originalUrl,
        method: req.method
    })
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))