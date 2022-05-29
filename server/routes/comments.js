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

router.post('/comment', (req, res) => {
    let text = req.body.comment;
    let user = req.body.user_id;
    let post = req.body.post_id;

    let q = 'INSERT INTO comments (text, commenter_id, post_id) VALUE (?, ?, ?)';

    conn.query(q, [text, user, post], (err, results, fields) => {
        res.json({status: 200});
    })
})

router.get('/comments', (req, res) => {
    let post_id = req.query.post;
    let user_id = req.query.user_id;

    let q = 'SELECT IF(cu.user_id = ?, \'upvote\', IF(cd.user_id = ?, \'downvote\', null)) AS vote, comments.comment_id, text, u.username, (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN users u on comments.commenter_id = u.user_id LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE post_id=? GROUP BY comments.comment_id;';
    let qwithoutuser = 'SELECT comments.comment_id, text, u.username, (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN users u on comments.commenter_id = u.user_id LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE post_id=? GROUP BY comments.comment_id;';

    if (!user_id) {
        conn.query(qwithoutuser, [post_id], (err, results, fields) => {
            res.json(results);
        })
    } else {
        conn.query(q, [user_id, user_id, post_id], (err, results, fields) => {
            res.json(results);
        })
    }
})

router.post('/upvote', (req, res) => {
    let user_id = req.body.user_id;
    let comment_id = req.body.comment;

    let q = 'INSERT INTO comment_upvotes (user_id, comment_id) VALUE (?, ?)';
    let pq = 'DELETE FROM comment_downvotes WHERE user_id=? AND comment_id=?';
    let q2 = 'SELECT (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE comments.comment_id=? GROUP BY comments.comment_id';

    try {
        conn.query(pq, [user_id, comment_id], (err, results, fields) => {
            if (err) {
                throw err;
            } else {
                conn.query(q, [user_id, comment_id], (err, results, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        conn.query(q2, [comment_id], (err, results, fields) => {
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
})

router.post('/downvote', (req, res) => {
    let user_id = req.body.user_id;
    let comment_id = req.body.comment;

    let q = 'INSERT INTO comment_downvotes (user_id, comment_id) VALUE (?, ?)';
    let q2 = 'SELECT (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE comments.comment_id=? GROUP BY comments.comment_id';
    let pq = 'DELETE FROM comment_upvotes WHERE user_id=? AND comment_id=?';

    try {
        conn.query(pq, [user_id, comment_id], (err, results, fields) => {
            if (err) {
                throw err;
            } else {
                conn.query(q, [user_id, comment_id], (err, results, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        conn.query(q2, [comment_id], (err, results, fields) => {
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
})

router.post('/unvote', (req, res) => {
    let user_id = req.body.user_id;
    let comment_id = req.body.comment;

    let q = 'DELETE FROM comment_downvotes WHERE user_id=? AND comment_id=?';
    let qd = 'DELETE FROM comment_upvotes WHERE user_id=? AND comment_id=?';
    let pq = 'SELECT (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE comments.comment_id=? GROUP BY comments.comment_id';

    conn.query(q, [user_id, comment_id], (err, results, fields) => {
        if (err) throw err;
        conn.query(qd, [user_id, comment_id], (err, results, fields) => {
            if (err) throw err;
            conn.query(pq, [comment_id], (err, results, fields) => {
                if (err) throw err;
                res.json(results);
            })
        })
    })
})

module.exports = router;
