const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");

module.exports = function (ioServer) {

    // map socket id to username
    const users = {};
    // map username to socket id for faster lookups
    const userSockets = {};

    ioServer.on("connection", (socket) => {

        // register user socket info
        socket.on("registerUser", (username) => {
            socket.username = username;

            // assign mapping
            users[socket.id] = username;
            userSockets[username] = socket.id;
        });

        // join a room
        socket.on("joinRoom", ({room}) => {
            socket.join(room);
            socket.room = room;
        });

        // leave a room
        socket.on("leaveRoom", () => {
            if (socket.room) {
                socket.leave(socket.room);
                socket.room = null;
            }
        });

        // disconnect the socket
        socket.on("disconnect", () => {
            delete users[socket.id];
            delete userSockets[socket.id];
        });

        // group message
        socket.on("groupMessage", async ({message}) => {

            // validation check
            if (!socket.username || !socket.room) return;

            // saves the message
            const msg = await GroupMessage.create({
                from_user: socket.username,
                room: socket.room,
                message
            });

            // sends the message to everyone connected to the room
            ioServer.to(socket.room).emit("groupMessage", msg);
        });

        // private message
        socket.on("privateMessage", async ({to_user, message}) => {

            // validation check
            if (!socket.username || !to_user || !message) return;

            const targetSocket = userSockets[to_user];

            if (targetSocket) {
                ioServer.to(targetSocket).emit("privateMessage", {
                    from_user: socket.username,
                    message
                });
            }

            // saves the message
            await PrivateMessage.create({
                from_user: socket.username,
                to_user,
                message
            });
        });

    });
};
