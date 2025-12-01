import fs from "fs/promises";
import path from "path";
import { v7 as uuidv7 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

async function readFileSafe(filePath) {
    try {
        const raw = await fs.readFile(filePath, "utf-8");
        return JSON.parse(raw);
    } catch {
        return { posts: [] };
    }
}

async function writeFileSafe(filePath, data) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function initializePostsFile() {
    try {
        const exists = await fs.access(POSTS_FILE).then(() => true).catch(() => false);
        if (!exists) await writeFileSafe(POSTS_FILE, { posts: [] });
        else {
            const data = await readFileSafe(POSTS_FILE);
            if (!data || !Array.isArray(data.posts)) await writeFileSafe(POSTS_FILE, { posts: [] });
        }
    } catch (err) {
        throw err;
    }
}

export async function getAllPosts(filters = {}) {
    const data = await readFileSafe(POSTS_FILE);
    let posts = Array.isArray(data.posts) ? data.posts.slice() : [];
    if (filters.id) {
        const ids = Array.isArray(filters.id) ? filters.id : [filters.id];
        posts = posts.filter((p) => ids.includes(p.id));
    }
    return posts;
}

export async function getPostById(postId) {
    const data = await readFileSafe(POSTS_FILE);
    return (data.posts || []).find((p) => p.id === postId) || null;
}

export async function getPostsByUserId(userId) {
    const data = await readFileSafe(POSTS_FILE);
    return (data.posts || []).filter((p) => p.userId === userId);
}

export async function createPost({ title, content, userId }) {
    const data = await readFileSafe(POSTS_FILE);
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const now = new Date().toISOString();
    const post = { id: uuidv7(), title, content, userId, createdAt: now, updatedAt: now };
    posts.push(post);
    await writeFileSafe(POSTS_FILE, { posts });
    return post;
}

export async function deletePost(postId) {
    const data = await readFileSafe(POSTS_FILE);
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return null;
    const [deleted] = posts.splice(idx, 1);
    await writeFileSafe(POSTS_FILE, { posts });
    return deleted;
}
