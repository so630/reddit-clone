import React, {useState} from "react";
import styles from './CommentVotes.module.css'
import arrow_nofill from "../../assets/comment_vote.svg";
import styles2 from'../../socials/post-page/comment/Comment.module.css';

export default function CommentVotes({result, id, vote}) {
    const [selection, setSelection] = useState(vote === 'upvote' ? 'top' : vote === 'downvote' ? 'bottom' : undefined);

    return (
        <div className={styles.votes + ' ' + styles2.votes}>
            <img src={arrow_nofill} alt="" className={selection === 'top' &&
                styles.fill} onClick={() => {
                setSelection(selection === 'top' ? undefined : 'top')
            }}/>
            <p>{result}</p>
            <img id={styles['bottom']} src={arrow_nofill}
                 className={selection === 'bottom' && styles.fill_bottom}
                 onClick={() => {
                     setSelection(selection === 'bottom' ? undefined : 'bottom')
                 }}
                 alt="" />
        </div>
    )
}
