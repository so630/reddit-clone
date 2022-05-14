import React, {useEffect, useState} from 'react';
import TopBar from "../../topbar/TopBar";
import styles from './Subreddit.module.css';
import PostForm from "./post-form/PostForm";
import {useParams, Navigate, Link} from "react-router-dom";
import PostCard from "../../cards-global/post-card/PostCard";

export default function Subreddit() {
    const [form, setForm] = useState(false);

    const [subredditTitle, setTitle] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [posts, setPosts] = useState([]);
    const [menu, setMenu] = useState('new')
    const {id} = useParams();

    let title = <><span style={{color: "#FF4500"}}>/r/</span><span style={{color: "#000"}}>{subredditTitle}</span></>;

    useEffect(() => {
        fetch('/subreddits/subreddit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({subreddit_id: id})
        }).then(r => r.json()).then(r => {
            if (r.status === 404) {
                setRedirect(true);
            } else {
                setTitle(r.name);
            }
        });

        fetch(`/subreddits/posts?subreddit_id=${id}&method=${menu}`).then(r => r.json()).then(r => {
            console.log(r);
            setPosts(r);
        })

        document.addEventListener('selection-topbar', (event) => {
            fetch(`/subreddits/posts?subreddit_id=${id}&method=${event.detail}`).then(r => r.json()).then(r => {
                setPosts(r);
                setMenu(event.detail);
            })
        })

        document.addEventListener('post', () => {
            fetch(`/subreddits/posts?subreddit_id=${id}&method=${menu}`).then(r => r.json()).then(r => {
                setPosts(r);
            })
        })


    }, [])

    if (redirect) {
        return <Navigate to={"/home"} />
    }

    return (
        <>
            <TopBar title={title} />
            <div className={styles.posts_container}>
                <div className={styles.container}>
                    <div className={styles.container}>
                        {posts.map(({name, username, title, result, time_passed, image_url, id}) => <PostCard result={result} id={id} image={image_url} user={username} subreddit={name} title={title} datetime={time_passed} />)}
                    </div>
                    <button className={styles.add_button} onClick={() => setForm(true)}>
                        +
                    </button>
                    {form &&
                        <PostForm cancel={() => setForm(false)} subreddit_id={id} />
                    }
                </div>
            </div>
        </>
    )
}
