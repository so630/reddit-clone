import React, {useEffect, useState} from "react";
import styles from "./Subreddits.module.css";
import PostCard from "../../cards-global/post-card/PostCard";
import SubredditCard from "../../cards-global/subreddit-card/SubredditCard";
import SubredditForm from "./subreddit-form/SubredditForm";
import Cookies from 'universal-cookie';
import loading_svg from '../../assets/loading-2.svg';
import {Link} from "react-router-dom";

export default function Subreddits() {
    const [form, setForm] = useState(false);
    const [subreddits, setSubreddits] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateSubreddits = () => {
        setLoading(true);
        fetch('https://sleepy-plateau-92845.herokuapp.com/subreddits/user-subreddits', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: new Cookies().get('session').split('\t')[1]})
        }).then(r => r.json()).then(r => {
            setSubreddits(r);
            setLoading(false);
        })
    }

    useEffect(() => {
        document.addEventListener('subreddit-create', () => {
            updateSubreddits();
        })

        updateSubreddits();
    }, [])

    return (
        <div className={styles.posts_container}>
            <div style={{display: 'inline-block', width: '100%'}}>
                {loading && <img src={loading_svg} alt=""/>}
                {subreddits.map(({name, description, posts, members, id}) => <Link to={`/r/${id}`}><SubredditCard name={name} description={description} posts={posts} members={members} /></Link>)}
                <div className={styles.separator}>+</div>
                <div className={styles.button} onClick={() => setForm(!form)}>{!form ? 'create new subreddit' : 'close'}</div>
                {
                    form
                    &&
                    <SubredditForm handleClose={() => setForm(false)} />
                }
            </div>
        </div>
    )
}
