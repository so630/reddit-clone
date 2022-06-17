import React, {useState} from "react";
import styles from './CommentVotes.module.css'
import arrow_nofill from "../../assets/comment_vote.svg";
import styles2 from'../../socials/post-page/comment/Comment.module.css';
import Cookies from 'universal-cookie';

export default function CommentVotes({result, id, vote}) {
    const [selection, setSelection] = useState(vote === 'upvote' ? 'top' : vote === 'downvote' ? 'bottom' : undefined);
    const [resultState, setResultState] = useState(result);

    const cast_vote = (selection) => {
        if (selection === 'top' && new Cookies().get('session')) {
            fetch('https://sleepy-plateau-92845.herokuapp.com/comments/upvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session').split('\t')[1], comment: id})
            }).then(r => r.json()).then(r => {
                setResultState(r[0].result);
            })
        } else if (selection === 'bottom' && new Cookies().get('session')) {
            fetch('https://sleepy-plateau-92845.herokuapp.com/comments/downvote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: new Cookies().get('session').split('\t')[1], comment: id})
            }).then(r => r.json()).then(r => {
                setResultState(r[0].result);
            })
        } else {
            if (new Cookies().get('session')) {
                fetch('https://sleepy-plateau-92845.herokuapp.com/comments/unvote', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({user_id: new Cookies().get('session').split('\t')[1], comment: id})
                }).then(r => r.json()).then(r => {
                    setResultState(r[0].result);
                })
            }
        }
    }


    return (
        <div className={styles.votes + ' ' + styles2.votes}>
            <img src={arrow_nofill} alt="" className={selection === 'top' &&
                styles.fill} onClick={() => {
                    if (new Cookies().get('session')) {
                        setSelection(selection === 'top' ? undefined : 'top')
                        cast_vote(selection === 'top' ? undefined : 'top');
                    }
            }}/>
            <p>{resultState}</p>
            <img id={styles['bottom']} src={arrow_nofill}
                 className={selection === 'bottom' && styles.fill_bottom}
                 onClick={() => {
                     if (new Cookies().get('session')) {
                         setSelection(selection === 'bottom' ? undefined : 'bottom');
                         cast_vote(selection === 'bottom' ? undefined : 'bottom');
                     }
                 }}
                 alt="" />
        </div>
    )
}
