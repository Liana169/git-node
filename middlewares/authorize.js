import * as Users from '../models/users.js';

export default async function authorize(req, res, next) {
    try {

        const userId = req.body.userId || req.query.userId || req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'User not authenticated' });
        }

        const user = await Users.getUserById(userId);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'User not found' });
        }

        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
}
