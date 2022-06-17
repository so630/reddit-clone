import React, {useEffect, useState} from "react";
import styles from "./SearchResults.module.css";
import SubredditCard from "../cards-global/subreddit-card/SubredditCard";
import loading_svg from '../assets/loading-2.svg';
import {Link, useLocation} from "react-router-dom";
import nothing from '../assets/nothing.webp';

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Subreddits() {
    const [form, setForm] = useState(false);
    const [subreddits, setSubreddits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);
    let query = useQuery();

    const updateSubreddits = () => {
        setLoading(true);
        fetch('https://sleepy-plateau-92845.herokuapp.com/subreddits/search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({search: query.get('search')})
        }).then(r => r.json()).then(r => {
            console.log(r);
            setSubreddits(r);
            setLoading(false);
            if(r.length === 0) {
                setNothingFound(true);
            }
        })
    }

    useEffect(() => {
        updateSubreddits();
    }, [])

    return (
        <div className={styles.posts_container}>
            <div style={{display: 'inline-block', width: '100%'}}>
                {loading && <img src={loading_svg} alt=""/>}
                {nothingFound && <img src={nothing} alt="nothing was found..."/>}
                {subreddits.map(({name, description, posts, members, subreddit_id}) => <Link to={`/r/${subreddit_id}`}><SubredditCard name={name} description={description} posts={posts} members={members} /></Link>)}
            </div>
        </div>
    )
}
