import React from 'react';
import styles from './SubredditCard.module.css';
import subreddit from '../../assets/subreddit-profile.png'

export default function SubredditCard({name, description, posts, members}) {
    return (
        <div className={styles.subreddit_card}>
            <h1><span>/r/{name}</span></h1>
            <h5>{description}</h5>
            <p>has <span>{posts} posts</span> <br/>and <span>{members} members</span></p>

            {/* on the right side */}
            <img src={subreddit} alt="subreddit"/>
        </div>
    )
}
