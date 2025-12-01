import jwt from "jsonwebtoken";
import HttpErrors from "http-errors";
import { createUser, findUserByEmail, checkPassword } from "../models/users.js";

const { JWT_SECRET } = process.env;

export async function register(req, res) {
    try {
        const { username, email, password, address } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ status: "error", message: "username, email, and password required" });
        }

        const user = await createUser({ username, email, password, address });
        res.json({ status: "ok", user });
    } catch (err) {
        res.status(err.status || 500).json({ status: "error", message: err.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "error", message: "email and password required" });
        }

        const user = await findUserByEmail(email);
        if (!user || !checkPassword(password, user.password)) {
            return res.status(401).json({ status: "error", message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

        res.json({ status: "ok", token, user });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
}

export default { register, login };
