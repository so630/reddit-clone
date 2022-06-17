import React, {useEffect, useState} from "react";
import TopBar from "../../topbar/TopBar";
import styles from './MainPage.module.css';
import styles2 from '../../socials/subreddit-page/Subreddit.module.css';
import PostCard from "../../cards-global/post-card/PostCard";
import loadingImage from '../../assets/loading-2.svg';

export default function MainPage() {

    const [posts, setPosts] = useState([]);
    const [method, setMethod] = useState('new');
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true)
        fetch(`https://sleepy-plateau-92845.herokuapp.com/posts/posts?method=${method}`).then(r => r.json()).then(r => {
            setPosts(r);
            setLoading(false);
        })


        document.addEventListener('selection-topbar', (event) => {
            setPosts([]);
            setLoading(true)
            fetch(`https://sleepy-plateau-92845.herokuapp.com/posts/posts?method=${event.detail}`).then(r => r.json()).then(r => {
                setPosts(r);
                setMethod(event.detail);
                setLoading(false);
            })
        })
    }, [])

    return (
        <>
            <TopBar />
            <div className={styles.posts_container}>
                <div className={styles2.container}>
                    <div className={styles2.container}>
                        {console.log(loading)}
                        {loading === true && <img src={loadingImage} alt="loading..."/>}
                        {posts.map(({name, username, title, result, time_passed, image_url, id}) => <PostCard id={id} image={image_url} user={username} subreddit={name} title={title} datetime={time_passed} />)}
                    </div>
                </div>
            </div>
        </>
    )
}
