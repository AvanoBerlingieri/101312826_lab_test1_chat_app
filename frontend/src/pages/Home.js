import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./css/Home.css"

export default function Home() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const rooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];
    const socketRef = useRef();

    // Initialize socket once
    useEffect(() => {
        socketRef.current = io("http://localhost:3001");

        // Register user
        socketRef.current.on("connect", () => {
            socketRef.current.emit("registerUser", storedUser.username);
        });

        // Listen for private messages
        socketRef.current.on("privateMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Listen for group messages
        socketRef.current.on("groupMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Listen for online users
        socketRef.current.on("onlineUsers", (users) => {
            setOnlineUsers(users.filter(u => u !== storedUser.username));
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Join a room
    const joinRoom = async (room) => {
        if (currentRoom) {
            socketRef.current.emit("leaveRoom");
        }
        setChatUser(null); // clear private chat
        setCurrentRoom(room);
        socketRef.current.emit("joinRoom", {room});

        // Load room chat history
        const res = await axios.get(`http://localhost:3001/api/messages/room/${room}`);
        setMessages(res.data);
    };

    const startPrivateChat = async (otherUser) => {
        setCurrentRoom(null); // leave room chat
        setChatUser(otherUser);

        // load chat history
        const res = await axios.get(`http://localhost:3001/api/messages/private/${storedUser.username}/${otherUser}`);
        setMessages(res.data);
    };

    const sendMessage = () => {
        if (!messageInput.trim()) return;

        if (chatUser) {
            socketRef.current.emit("privateMessage", {
                to_user: chatUser,
                message: messageInput
            });
        } else if (currentRoom) {
            socketRef.current.emit("groupMessage", {message: messageInput});
        }

        setMessageInput("");
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="home-container">

            <div className="sidebar">
                <h3>Rooms</h3>
                {rooms.map(room => (
                    <button key={room} onClick={() => joinRoom(room)}>
                        {room}
                    </button>
                ))}
            </div>

            <div className="chat-area">
                <div className="messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="message">
                            <strong>{msg.from_user}:</strong> {msg.message}
                        </div>
                    ))}
                </div>

                <div className="input-area">
                    <input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>

            <div className="sidebar sidebar-right">
                <button className="logoutBtn" onClick={handleLogout}>
                    Logout
                </button>

                <h3>Online Users</h3>
                {onlineUsers.map(user => (
                    <button key={user} onClick={() => startPrivateChat(user)}>
                        {user}
                    </button>
                ))}
            </div>

        </div>
    );

}
