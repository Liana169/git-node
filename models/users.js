import fs from 'fs/promises';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data/users.json');

export async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}


export async function getAllUsers() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}


export async function createUser({ username, email, password }) {
    const data = await getAllUsers();
    const newUser = {
        id: uuidv7(),
        username,
        email,
        password
    };
    data.push(newUser);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return newUser;
}


export async function getUserByEmail(email) {
    const data = await getAllUsers();
    return data.find(u => u.email === email) || null;
}


export async function getUserById(id) {
    const data = await getAllUsers();
    return data.find(u => u.id === id) || null;
}
