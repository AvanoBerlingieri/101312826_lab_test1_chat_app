import axios from "axios";

export async function logout() {
    const res = await axios.post(
        "http://localhost:3001/api/user/logout",
        {
            headers: {"Content-Type": "application/json"},
        }
    );
    return res.data;
}
