import React from 'react';
import styles from './PostCard.module.css';

export default function PostCard({title, datetime, user, subreddit, number_of_likes, number_of_comments, image}) {
    return (
        <div className={styles.post_card}>
            <img src={image} alt=""/>
            <h1>{title}</h1>
            <p>6 hours ago by <span>{user}</span></p> {/* will have a date system setup, but for now will just use hardcoded*/}
            <p id={styles.sr}>/r/<span>{subreddit}</span></p>
        </div>
    )
}
