import * as Users from '../models/users.js';


export async function registration(req, res, next) {
    try {
        const { username, email, password, address} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        const existingUser = await Users.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email already exists' });
        }

        const newUser = await Users.createUser({ username, email, password, address });
        res.status(201).json({ status: 'ok', user: { id: newUser.id, username: newUser.username, email: newUser.email,address: newUser.address } });
    } catch (err) {
        next(err);
    }
}


export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password required' });
        }

        const user = await Users.getUserByEmail(email);
        if (!user || user.password !== password) { // hash-ով դեռ չենք աշխատում
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        res.json({ status: 'ok', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        next(err);
    }
}


export async function getProfile(req, res, next) {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(400).json({ status: 'error', message: 'UserId required' });

        const user = await Users.getUserById(userId);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        res.json({ status: 'ok',
            user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        next(err);
    }
}
