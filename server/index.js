const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pino = require('express-pino-logger')();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(pino);

const authRoutes = require('./routes/authorization');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/user', userRoutes);

const subredditRoutes = require('./routes/subreddits');
app.use('/subreddits', subredditRoutes);

const postRoutes = require('./routes/post');
app.use('/posts', postRoutes);

const commentRoutes = require('./routes/comments');
app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 80;

app.listen(PORT, () =>
  console.log('Express server is running on ' + PORT)
);
