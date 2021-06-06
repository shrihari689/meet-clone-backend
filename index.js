const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000', "https://meet-clone-shrihari689.web.app"],
    }
});
const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
    console.log("New Connection: " + socket.id)
    socket.on("joinCall", (data) => {
        const { meetId } = JSON.parse(data)
        socket.meetId = meetId
        socket.join(meetId);
        console.log("Meet ID: " + meetId)
    })
    socket.on("newMessage", (data) => {
        io.to(socket.meetId).emit("newMessage", data)
    })
    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.id)
    })
})


server.listen(PORT, () => {
    console.log("Listening on " + PORT)
})