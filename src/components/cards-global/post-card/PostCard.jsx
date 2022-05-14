import React, {useEffect, useState} from 'react';
import styles from './PostCard.module.css';
import {Link} from "react-router-dom";
import Votes from "../Votes";

export default function PostCard({title, datetime, user, subreddit, result, number_of_likes, number_of_comments, image, id}) {

    const [time, setTime] = useState(datetime);

    useEffect(() => {
        if (datetime > 60*24*7) {
            setTime(Math.floor(datetime / (60*24*7)) + " week(s) ");
        } else if (datetime > 60*24) {
            setTime(Math.floor(datetime / (60*24)) + " day(s) ");
        } else if (datetime > 60) {
            setTime(Math.floor(datetime / 60) + " hour(s) ");
        } else {
            setTime(datetime + " minute(s) ");
        }
    }, []);


    return (
        <Link to={`/p/${id}`}>
            <div className={styles.post_card}>
                {image !== null && <img src={image} alt=""/>}
                <h1>{title}</h1>
                <p>{time} ago by <br />/u/<span>{user}</span></p>
                <p id={styles.sr}>/r/<span>{subreddit}</span></p>
            </div>
        </Link>
    )
}
