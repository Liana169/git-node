import { initializeDataFile } from './users.js';
import { initializePostsFile } from './posts.js';

await initializeDataFile();
await initializePostsFile();
