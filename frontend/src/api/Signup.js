import axios from "axios";

export async function signup(data) {
    const res = await axios.post(
        "http://localhost:3001/api/user/signup",
        data,
        {
            headers: {"Content-Type": "application/json"},
        }
    );
    return res.data;
}
