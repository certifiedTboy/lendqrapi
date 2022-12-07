import http from "http"
import app from "./app"
import config from "./config"

const server = http.createServer(app)

const PORT = config.APP_PORT || 3000




const startServer = async() => {
    server.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`)
    })
}


startServer()