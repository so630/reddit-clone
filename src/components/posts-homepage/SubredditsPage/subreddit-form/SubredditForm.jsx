import React from "react";
import styles from './SubredditForm.module.css';
import SubredditCard from "../../../cards-global/subreddit-card/SubredditCard";
import {useState, useEffect, useRef} from 'react';
import '../../../InputStyle.css';
import Cookies from "universal-cookie";

export default function SubredditForm({handleClose}) {
    const [name, setName] = useState('unnamed');
    const [desc, setDesc] = useState('write a description');
    const form = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            form.current.classList.add(styles.open);
        })
    }, []);

    const handleSubmit = () => {
        const cookies = new Cookies();
        let id = cookies.get('session').split('\t')[1];
        document.querySelector('#name').value = '';
        document.querySelector('#description').value = '';
        fetch('https://sleepy-plateau-92845.herokuapp.com/subreddits/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, description: desc, user: id})
        }).then(r => r.json()).then(r => {
            console.log(r);
            const event = new Event('subreddit-create');
            document.dispatchEvent(event);
            handleClose();
        })
    }


    return (
        <div className={styles.subreddit_form} ref={form}>
            <div className="form__group field" style={{width: '20%', marginLeft: '30px'}}>
                <input autoComplete="off" id="name" type="email" className="form__field" placeholder={"Username..."} onChange={(event) => setName(event.target.value)}/>
                <label htmlFor="name" className="form__label">name</label>
            </div>

            <div className="form__group field" style={{width: '60%', marginLeft: '30px'}}>
                <input autoComplete="off" id="description" type="email" className="form__field" placeholder={"Username..."} onChange={(event) => setDesc(event.target.value)}/>
                <label htmlFor="description" className="form__label">description</label>
            </div>

            <SubredditCard name={name} description={desc} posts={0} members={0} />

            <button disabled={!(name !== 'unnamed' && desc !== 'no description given')} onClick={handleSubmit}>Submit</button>
            <button onClick={handleClose} style={{right: '110px'}}>Close</button>
        </div>
    )
}
