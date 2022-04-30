import React, { useState } from "react";
import styles from "./Subreddits.module.css";
import PostCard from "../../cards-global/post-card/PostCard";
import SubredditCard from "../../cards-global/subreddit-card/SubredditCard";
import SubredditForm from "./subreddit-form/SubredditForm";

export default function Subreddits() {
    const [form, setForm] = useState(false);

    return (
        <div className={styles.posts_container}>
            <div style={{display: 'inline-block', width: '100%'}}>
                <SubredditCard name="SussyAmogus" description="A subreddit where you can be sus" posts={50} members={236} />
                <div className={styles.separator}>+</div>
                <div className={styles.button} onClick={() => setForm(!form)}>{!form ? 'create new subreddit' : 'close'}</div>
                {
                    form
                    &&
                    <SubredditForm />
                }
            </div>
        </div>
    )
}
