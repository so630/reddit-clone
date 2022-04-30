import React from "react";
import styles from './SubredditForm.module.css';
import SubredditCard from "../../../cards-global/subreddit-card/SubredditCard";
import {useState} from 'react';

export default function SubredditForm() {
    const [name, setName] = useState('unnamed');
    const [desc, setDesc] = useState('write a description');

    return (
        <div className={styles.subreddit_form}>
            <input id="name" placeholder="Name..." autoComplete={"off"} onChange={(event) => {
                setName(event.target.value === '' ? 'unnamed' : event.target.value);
            }} />

            <textarea id="description" placeholder={"Description..."} onChange={(event) => {
                setDesc(event.target.value === '' ? 'write a description' : event.target.value);
            }} />

            <SubredditCard name={name} description={desc} posts={0} members={0} />

            <button disabled={!(name !== 'unnamed' && desc !== 'no description given')}>Submit</button>
        </div>
    )
}
