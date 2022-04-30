const express = require('express');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const router = express.Router();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saneu493',
    database: 'reddit_clone'
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let avatar = req.body.avatar;

    bcrypt.hash(password, 10, (err, hash) => {
        let q = `INSERT INTO avatars (image_url) VALUE (?)`;
        let q2 = `SELECT avatar_id FROM avatars ORDER BY avatar_id DESC LIMIT 1`;
        let q3 = `INSERT INTO users (username, password, email, avatar_id) VALUE (?, ?, ?, ?)`;
        let q4 = `SELECT * FROM users ORDER BY user_id DESC LIMIT 1`; // only for debugging

        conn.query(q, [avatar], (err, results, fields) => {
            if (err) throw err;
            conn.query(q2, (err, results, fields) => {
                if (err) throw err;
                let avatar_id = results[0]['avatar_id'];

                conn.query(q3, [username, hash, email, avatar_id], (err, results, fields) => {
                    if (err) throw err;
                    res.json({status: 200});
                })
            })
        })
    })
})

router.post('/sign-in', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let q1 = `SELECT password FROM users WHERE email=?`;
    conn.query(q1, [email], (err, results, fields) => {
        let hash = results[0]['password'];
        bcrypt.compare(password, hash, (err, result) => {
            res.json({result});
        })
    })
})

module.exports = router;
