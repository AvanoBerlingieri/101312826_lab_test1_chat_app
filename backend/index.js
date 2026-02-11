const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/user");
const messagingRoutes = require("./routes/messaging");
const socket = require("./sockets/ChatSocket");
const cors = require("cors");
const io = require("socket.io");
require("dotenv").config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", usersRoutes);
app.use("/api", messagingRoutes);

app.get("/", (req, res) => {
    res.send("<h1>COMP3133 Lab Test 1</h1>");
});

mongoose.connect(DB_CONNECTION_STRING, {
}).then(() => {
    console.log("MongoDB Connected!")
    app.listen(SERVER_PORT, () => {
        console.log(`Server running at http://localhost:${SERVER_PORT}/`)
    })
}).catch(err => {
    console.log(err)
})