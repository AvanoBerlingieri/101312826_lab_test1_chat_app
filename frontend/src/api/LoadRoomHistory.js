import axios from "axios";

export async function LoadRoomHistory(room) {
    const res = await axios.get(`http://localhost:3001/api/messages/room/${room}`);
    return res.data;
}
