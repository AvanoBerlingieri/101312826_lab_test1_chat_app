import axios from "axios";

export async function LoadPrivateChatHistory(username, otherUser) {
    const res = await axios.get(`http://localhost:3001/api/messages/private/${username}/${otherUser}`);
    return res.data;
}
