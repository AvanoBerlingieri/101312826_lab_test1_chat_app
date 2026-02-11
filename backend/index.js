// index.js
const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/user");
const messagingRoutes = require("./routes/messaging");
const ChatSocket = require("./sockets/ChatSocket");
const cors = require("cors");
require("dotenv").config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", usersRoutes);
app.use("/api/messages", messagingRoutes); // <- note /messages

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

ChatSocket(io); // attach your socket handlers

mongoose.connect(DB_CONNECTION_STRING)
    .then(() => {
        console.log("MongoDB Connected!");
        http.listen(SERVER_PORT, () => {
            console.log(`Server running at http://localhost:${SERVER_PORT}/`);
        });
    })
    .catch(err => console.log(err));
