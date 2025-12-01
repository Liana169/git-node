import jwt from "jsonwebtoken";
import HttpErrors from "http-errors";

const { JWT_SECRET } = process.env;

export default function authorize(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw HttpErrors(401, "Authorization header missing");
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            throw HttpErrors(401, "Invalid authorization format (must be Bearer token)");
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
        };

        next();
    } catch (err) {
        next(err);
    }
}
