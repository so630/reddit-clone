import React, {useEffect, useState} from "react";
import TopBar from "../../topbar/TopBar";
import styles from './MainPage.module.css';
import styles2 from '../../socials/subreddit-page/Subreddit.module.css';
import PostCard from "../../cards-global/post-card/PostCard";

export default function MainPage() {

    const [posts, setPosts] = useState([]);
    const [method, setMethod] = useState('new');

    useEffect(() => {
        fetch(`/posts/posts?method=${method}`).then(r => r.json()).then(r => {
            setPosts(r);
        })

        document.addEventListener('selection-topbar', (event) => {
            fetch(`/posts/posts?method=${event.detail}`).then(r => r.json()).then(r => {
                setPosts(r);
                setMethod(event.detail);
            })
        })
    }, [])

    return (
        <>
            <TopBar />
            <div className={styles.posts_container}>
                <div className={styles2.container}>
                    <div className={styles2.container}>
                        {posts.map(({name, username, title, result, time_passed, image_url, id}) => <PostCard id={id} image={image_url} user={username} subreddit={name} title={title} datetime={time_passed} />)}
                    </div>
                </div>
            </div>
        </>
    )
}
