import React, {useState, useRef} from "react";
import styles from './Comment.module.css';
import Cookies from "universal-cookie";
import '../../../InputStyle.css';
import img from '../../../assets/send.png';

export default function CommentForm({post_id, update}) {

    const [comment, setComment] = useState('');
    const ref = useRef(null);

    const comment_post = () => {
        let user_id = new Cookies().get('session').split('\t')[1];

        fetch('/comments/comment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({comment: comment, user_id: user_id, post_id: post_id})
        }).then(r => r.json()).then(r => {
            update();

        })
    }

    return (
        <div className={styles.comment}>
            <div className={`form__group field ${styles.field}`} style={{width: '80%', display: 'inline-block'}}>
                <input autoComplete="off" id="comment" type="text" className="form__field" placeholder={"Username..."} ref={ref} onChange={(e) => setComment(e.target.value)}/>
                <label htmlFor="comment" className="form__label">comment</label>
            </div>
            <button onClick={comment_post}>
                <img src={img} alt="send"/>
            </button>
        </div>
    )
}
