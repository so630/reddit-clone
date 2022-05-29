import React from "react";
import styles from './Comment.module.css';
import CommentVotes from "../../../cards-global/votes-comments/CommentVotes";

export default function Comment({title, result, username, time, id, vote}) {
    return (
        <div className={styles.comment}>
            <CommentVotes result={result} id={id} vote={vote} />
            <h1>{title}</h1>
            <p>{username}</p>
        </div>
    )
}
