import fs from 'fs/promises';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';

const DATA_FILE = path.join(process.cwd(), 'data/posts.json');


export async function initializePostsFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}
export async function getAllPosts(filters = {}) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    if (filters.id) return data.filter(post => post.id === filters.id);
    return data;
}


export async function getPostById(postId) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    return data.posts.find(p => p.id === postId) || null;
}


export async function getPostsByUserId(userId) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    return data.filter(p => p.userId === userId);
}


export async function createPost({ title, content, userId }) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const newPost = {
        id: uuidv7(),
        title,
        content,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    data.push(newPost);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return newPost;
}


export async function updatePost(postId, updates) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const index = data.findIndex(p => p.id === postId);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return data[index];
}


export async function deletePost(postId) {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const index = data.findIndex(p => p.id === postId);
    if (index === -1) return false;
    data.splice(index, 1);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
}
