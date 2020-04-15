const express = require("express")
const logger = require("./middleware/logger")
const userRouter = require("./users/userRouter")

const server = express()
const port = 4000

server.use(express.json())
server.use(logger({ format: "long" }))

server.use("/users", userRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
