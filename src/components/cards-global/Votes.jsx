import React from 'react';
import Cookies from "universal-cookie";
import styles from "../socials/post-page/Post.module.css";
import arrow_nofill from "../assets/arrow_nofill.svg";
import {useState} from "react";

export default function Votes({result, id, vote, setResult}) {
    const [selection, setSelection] = useState(vote === 'upvote' ? 'top' : vote === 'downvote' ? 'bottom' : undefined);
    const [resultState, setResultState] = useState(result);

    const upvote = () => {
        if (new Cookies().get('session') && selection !== 'top') {
            setSelection('top') // selection === 'top' ? undefined : 'top'
            fetch('/posts/upvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session')?.split('\t')[1], post_id: id})
            }).then(r => {
                if (r.ok) {
                    return r.json();
                }
            }).then(r => {
                setResultState(r[0].result);
            })
        } else if (new Cookies().get('session') && selection === "top") {
            setSelection(undefined)
            fetch('/posts/unvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session')?.split('\t')[1], post_id: id})
            }).then(r => {
                if (r.ok) {
                    return r.json();
                }
            }).then(r => {
                setResultState(r[0].result);
            })
        }
    }

    const downvote = () => {
        if (new Cookies().get('session') && selection !== 'bottom') {
            setSelection('bottom') //selection === 'bottom' ? undefined : 'bottom'
            fetch('/posts/downvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session')?.split('\t')[1], post_id: id})
            }).then(r => {
                if (r.ok) {
                    return r.json();
                } else {
                    // TODO: add some code to indicate to user they did something illegal
                }
            }).then(r => {
                setResultState(+(r[0].result));
            })
        } else if (new Cookies().get('session') && selection === "bottom") {
            setSelection(undefined)
            fetch('/posts/unvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session')?.split('\t')[1], post_id: id})
            }).then(r => {
                if (r.ok) {
                    return r.json();
                }
            }).then(r => {
                setResultState(+(r[0].result));
            })
        }
    }

    return (
        <div className={styles.votes}>
            <img src={arrow_nofill} alt="" className={selection === 'top' && styles.fill} onClick={upvote}/>
            <p>{resultState}</p>
            <img id={styles['bottom']} src={arrow_nofill} className={selection === 'bottom' && styles.fill_bottom} alt="" onClick={downvote}/>
        </div>
    )
}
