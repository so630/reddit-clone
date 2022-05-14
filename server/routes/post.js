const express = require('express');
const mysql = require("mysql");
const router = express.Router();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saneu493',
    database: 'reddit_clone'
});

process.on('uncaughtException', function (err) {
    console.error(err);
});

router.post('/create', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let poster_id = req.body.poster_id;
    let subreddit_id = req.body.subreddit_id;
    let image_url = req.body.image_url;

    console.log(image_url);

    let q = 'INSERT INTO photos (image_url) VALUE (?)';
    let q2 = 'INSERT INTO posts (title, description, time_posted, poster_id, subreddit_id, photo_id) VALUE (?, ?, NOW(), ?, ?, ?)' // only if image_url is specified
    let qWithoutImage = 'INSERT INTO posts (title, description, time_posted, poster_id, subreddit_id) VALUE (?, ?, NOW(), ?, ?)' // only if image_url is not specified

    if (image_url !== null) {
        conn.query(q, [image_url], (err, results, fields) => {
            let photo_id = results.insertId;
            conn.query(q2, [title, description, poster_id, subreddit_id, photo_id], (err, results, fields) => {
                if (err) throw err;
                res.json({status: 200})
            })
        })
    } else {
        conn.query(qWithoutImage, [title, description, poster_id, subreddit_id], (err, results, fields) => {
            if (err) throw err;
            res.json({status: 200})
        })
    }
});

router.get('/posts', (req, res) => {
    let method = req.query.method.toLowerCase();

    let qNew = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id GROUP BY posts.post_id ORDER BY time_passed;';
    let qHot = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id GROUP BY posts.post_id ORDER BY result DESC, time_passed;';
    let qTop = 'SELECT posts.post_id AS id, name, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id GROUP BY posts.post_id ORDER BY result DESC;';

    if (method === 'new') {
        conn.query(qNew, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    } else if (method === 'hot') {
        conn.query(qHot, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    } else if (method === 'top') {
        conn.query(qTop, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    }
})

router.post('/upvote', (req, res) => {
    let q = 'INSERT INTO upvotes (user_id, post_id) VALUE (?, ?)'
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;

    let q2 = 'SELECT (COUNT(u.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN upvotes u on posts.post_id = u.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id where posts.post_id=? GROUP BY posts.post_id'
    let pq = 'DELETE FROM downvotes WHERE user_id=? AND post_id=?'

    try {
        conn.query(pq, [user_id, post_id], (err, results, fields) => {
            if (err) {
                throw err;
            } else {
                conn.query(q, [user_id, post_id], (err, results, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        conn.query(q2, [post_id], (err, results, fields) => {
                            if (err) throw err;
                            res.json(results);
                        })
                    }
                })
            }
        })
    } catch (e) {
        res.json({status: 500});
    }
});

router.post('/downvote', (req, res) => {
    let q = 'INSERT INTO downvotes (user_id, post_id) VALUE (?, ?)'
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;

    let q2 = 'SELECT (COUNT(u.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN upvotes u on posts.post_id = u.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id where posts.post_id=? GROUP BY posts.post_id'
    let pq = 'DELETE FROM upvotes WHERE user_id=? AND post_id=?'

    conn.query(pq, [user_id, post_id], (err, results, fields) => {
        if (err) {
            throw err;
        } else {
            console.log('ok')
            conn.query(q, [user_id, post_id], (err, results, fields) => {
                if (err) {
                    throw err;
                } else {
                    conn.query(q2, [post_id], (err, results, fields) => {
                        if (err) throw err;
                        res.json(results);
                    })
                }
            })
        }
    })
});

router.post('/unvote', (req, res) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;

    let q = 'DELETE FROM upvotes WHERE user_id=? AND post_id=?';
    let qd = 'DELETE FROM downvotes WHERE user_id=? AND post_id=?';
    let pq = 'SELECT (COUNT(u.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN upvotes u on posts.post_id = u.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id where posts.post_id=? GROUP BY posts.post_id';

    conn.query(q, [user_id, post_id], (err, results, fields) => {
        if (err) throw err;
        conn.query(qd, [user_id, post_id], (err, results, fields) => {
            if (err) throw err;
            conn.query(pq, [post_id], (err, results, fields) => {
                if (err) throw err;
                res.json(results);
            })
        })
    })
})

router.get('/post', (req, res) => {
    let id = req.query.id;
    let user = req.query.user;
    let q = 'SELECT s.subreddit_id AS subreddit_id, name, posts.description, username, title, image_url, TIMESTAMPDIFF(MINUTE, time_posted, NOW()) AS time_passed, (COUNT(u2.user_id) - COUNT(d.user_id)) AS result FROM posts LEFT JOIN subreddits s on posts.subreddit_id = s.subreddit_id LEFT JOIN users u on posts.poster_id = u.user_id LEFT JOIN photos p on posts.photo_id = p.photo_id LEFT JOIN upvotes u2 on posts.post_id = u2.post_id LEFT JOIN downvotes d on posts.post_id = d.post_id WHERE posts.post_id=? GROUP BY posts.post_id ORDER BY time_passed;';
    let quser = 'SELECT user_id FROM upvotes WHERE post_id=? AND user_id=?';
    let quserd = 'SELECT user_id FROM downvotes WHERE post_id=? AND user_id=?';
    if (!user || user === 'undefined') {
        conn.query(q, [id], (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    } else {
        conn.query(q, [id], (err, results, fields) => {
            if (err) throw err;
            conn.query(quser, [id, user], (err, results2, fields) => {
                if (results2[0]) {
                    if (results2[0].user_id === 6) {
                        results[0]['vote'] = 'upvote';
                        res.json(results);
                    }
                } else {
                    conn.query(quserd, [id, user], (err, results2, fields) => {
                        if (results2[0]) {
                            if (results2[0].user_id === 6) {
                                results[0]['vote'] = 'downvote';
                                res.json(results);
                            }
                        } else {
                            res.json(results);
                        }
                    })
                }
            })
        })
    }
})

module.exports = router;
