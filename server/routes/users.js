const express = require('express');
const mysql = require("mysql");
const config = require("./config");
const router = express.Router();

const conn = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE
});

router.post('/details', (req, res) => {
    let id = req.body.id;

    let q = 'SELECT username, email, avatar_id FROM users WHERE user_id=? LIMIT 1';

    conn.query(q, [id], (err, results, fields) => {
        if (err) throw err;
        res.json(results[0]);
    })
})

router.post('/avatar', (req, res) => {
    let id = req.body.id;
    let q = 'SELECT image_url FROM avatars WHERE avatar_id=?';

    conn.query(q, [id], (err, results, fields) => {
        if (err) throw err;
        res.json(results[0])
    })
})

router.post('/edit', (req, res) => {
    let id = req.body.id;
    let avatar_url = req.body.avatar;
    let username = req.body.username;
    let email = req.body.email;

    let q = 'UPDATE users SET username=?, email=? WHERE user_id=?';
    let q2 = 'SELECT avatar_id FROM users WHERE user_id=?';
    let q3 = 'UPDATE avatars SET image_url=? WHERE avatar_id=?';
    let q4 = 'SELECT username, email, avatar_id FROM users WHERE user_id=?';
    let q5 = 'SELECT image_url FROM avatars WHERE avatar_id=?';

    conn.query(q, [username, email, id], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        conn.query(q2, [id], (err, result, fields) => {
            if (err) throw err;
            let av_id = result[0].avatar_id;
            conn.query(q3, [avatar_url, av_id], (err, result, fields) => {
                if (err) throw err;
                conn.query(q4, [id],  (err, result, fields) => {
                    let res2 = result;
                    conn.query(q5, [result[0]['avatar_id']], (err, result, fields) => {
                        if (err) throw err;
                        res2[0]['avatar'] = result[0]['image_url'];
                        res.json(res2);
                    });
                })
            })
        })
    })
})

module.exports = router;
