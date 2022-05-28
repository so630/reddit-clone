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

    let q = 'SELECT text, u.username, (COUNT(cu.user_id) - COUNT(cd.user_id)) AS result FROM comments LEFT JOIN users u on comments.commenter_id = u.user_id LEFT JOIN comment_downvotes cd on comments.comment_id = cd.comment_id LEFT JOIN comment_upvotes cu on comments.comment_id = cu.comment_id WHERE post_id=? GROUP BY comments.comment_id;';

    conn.query(q, [post_id], (err, results, fields) => {
        res.json(results);
    })
})

module.exports = router;
