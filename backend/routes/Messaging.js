const express = require("express");
const routes = express.Router()
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

// get group chat history
routes.get("/room/:room", async (req, res) => {
    try {
        const messages = await GroupMessage.find({
            room: req.params.room
        }).sort({ date_sent: 1 }); // sort messages by time

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get private chat history
routes.get("/private/:user1/:user2", async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        // search the private message collection for all messages between 2 users
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: user1, to_user: user2 },
                { from_user: user2, to_user: user1 }
            ]
        }).sort({ date_sent: 1 }); // sort messages by time

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = routes