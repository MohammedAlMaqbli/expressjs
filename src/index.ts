import express from "express";
import { createServer } from "https";
import { Server } from "socket.io";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
 });
const port = process.env.PORT || 3333;



app.get("/", async (req, res) => {
  res.json({ Hello: "World" });
});








const users:any = [];
const members:any = [];

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("user_connected", function (user_id) {
        users[user_id] = socket.id;
        io.emit("updateUserStatus", users);
        console.log("user connected " + user_id);
    });

    socket.on("member_connected", function (user_id) {
        members[user_id] = socket.id;
        io.emit("updateMemberStatus", members);
        console.log("member connected " + user_id);
    });

    socket.on("disconnect", function () {
        var i = users.indexOf(socket.id);
        users.splice(i, 1, 0);
        io.emit("updateUserStatus", users);
    });

    socket.on("send_message", function (message) {
        io.to(`${users[message.receiver_id]}`).emit("receive_message", message);
    });

    socket.on("send_message-member", function (message) {
        io.to(`${members[message.receiver_id]}`).emit(
            "receive_message-member",
            message
        );
    });
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



