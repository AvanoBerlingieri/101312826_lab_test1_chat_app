import axios from "axios";

export async function login(data) {
    const res = await axios.post(
        "http://localhost:3001/api/user/login",
        data,
        {
            headers: {"Content-Type": "application/json"},
        }
    );
    return res.data;
}
