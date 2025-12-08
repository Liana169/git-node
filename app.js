import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import { initializeDataFile } from './models/users.js';
import { initializePostsFile } from './models/posts.js';

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


await initializeDataFile();
await initializePostsFile();


app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);


app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
