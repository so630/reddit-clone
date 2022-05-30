const express = require('express');
const mysql = require("mysql");
const router = express.Router();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS,
    database: 'reddit_clone'
});

router.post('/create', (req, res) => {
    let user_id = req.body.user;
    let name = req.body.name;
    let description = req.body.description;

    let q = 'INSERT INTO subreddits (owner_id, name, description) VALUE (?, ?, ?)';

    conn.query(q, [user_id, name, description], (err, results, fields) => {
        if (err) throw err;
        res.json({status: 200})
    });
})

router.post('/user-subreddits', (req, res) => {
    let q = 'SELECT subreddits.subreddit_id AS id, name, subreddits.description, COUNT(title) AS posts, COUNT(SJ.user_id) AS members FROM subreddits LEFT JOIN posts p on subreddits.subreddit_id = p.subreddit_id LEFT JOIN subreddit_joins sj on subreddits.subreddit_id = sj.subreddit_id WHERE owner_id=? GROUP BY subreddits.subreddit_id;'
    let id = req.body.user;
    console.log(id);

    conn.query(q, [id], (err, results, fields) => {
        console.log(results);
        res.json(results);
    })
})

router.post('/subreddit', (req, res) => {
    let q = 'SELECT name FROM subreddits WHERE subreddit_id=?';
    let id = req.body.subreddit_id;

    conn.query(q, [id], (err, results, fields) => {
        console.log(results);
        if (results.length === 0) {
            res.json({status: 404})
        } else {
            res.json(results[0]);
        }
    })
})

router.get('/posts', (req, res) => {
    let subreddit_id = req.query.subreddit_id;
    let method = req.query.method.toLowerCase();

    let qNew = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id WHERE s.subreddit_id=? GROUP BY posts.post_id ORDER BY time_passed;';
    let qHot = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id WHERE s.subreddit_id=? GROUP BY posts.post_id ORDER BY result DESC, time_passed;';
    let qTop = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id WHERE s.subreddit_id=? GROUP BY posts.post_id ORDER BY result DESC;';

    if (method === 'new') {
        conn.query(qNew, [subreddit_id], (err, results, fields) => {
            if (err) throw err;
            console.log(results);
            res.json(results);
        })
    } else if (method === 'hot') {
        conn.query(qHot, [subreddit_id], (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    } else if (method === 'top') {
        conn.query(qTop, [subreddit_id], (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    }
})

router.post('/search', (req, res) => {
    let query = req.body.search;

    let q = 'SELECT name, subreddits.subreddit_id, subreddits.description, COUNT(title) AS posts, COUNT(SJ.user_id) AS members FROM subreddits LEFT JOIN posts p on subreddits.subreddit_id = p.subreddit_id LEFT JOIN subreddit_joins sj on subreddits.subreddit_id = sj.subreddit_id WHERE name LIKE CONCAT(\'%\', ?, \'%\') GROUP BY subreddit_id;';

    conn.query(q, [query], (err, results, fields) => {
        console.log(results);
        res.json(results);
    })
})

module.exports = router;
