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

            // mapping users
            users[socket.id] = username;
            userSockets[username] = socket.id;

            // send user list to all connected clients
            ioServer.emit("onlineUsers", Object.values(users));
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
            delete userSockets[socket.username];
            ioServer.emit("onlineUsers", Object.values(users));
        });

        // group message
        socket.on("groupMessage", async ({message}) => {

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

            if (!socket.username || !to_user || !message) return;

            const msg = {
                from_user: socket.username,
                to_user,
                message
            };

            const targetSocket = userSockets[to_user];

            // send to receiver
            if (targetSocket) {
                ioServer.to(targetSocket).emit("privateMessage", msg);
            }

            // send msg to sender so chat is updated for both sides
            socket.emit("privateMessage", msg);

            // save message
            await PrivateMessage.create(msg);
        });
    });
};
