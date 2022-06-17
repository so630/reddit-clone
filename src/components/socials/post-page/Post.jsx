import React, {useEffect, useState} from "react";
import styles from './Post.module.css'
import TopBar from "../../topbar/TopBar";
import arrow_nofill from '../../assets/arrow_nofill.svg';
import Cookies from "universal-cookie";
import {Link, useParams} from "react-router-dom";
import AnimatedNumber from "react-animated-numbers";
import Votes from "../../cards-global/Votes";
import Comment from "./comment/Comment";
import CommentForm from "./comment/CommentForm";
import loadingImage from '../../assets/loading-2.svg';

export default function Post() {

    const {id} = useParams();
    const [data, setData] = useState({});
    const [time, setTime] = useState('');

    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(null);
    const [postLoading, setPostLoading] = useState(null);

    let title = <Link to={`/r/${data.subreddit_id}`}><span style={{color: "#FF4500"}}>/r/</span><span style={{color: "#000"}}>{data.name}</span></Link>;

    useEffect(() => {
        let user_id = new Cookies().get('session')?.split('\t')[1];

        setPostLoading(true)
        fetch(`/posts/post?post=${id}&user=${user_id}`).then(r => r.json()).then(r => {
            setData(r[0]);
            setPostLoading(false);

            let datetime = r[0].time_passed;

            if (datetime > 60*24*7) {
                setTime(Math.floor(datetime / (60*24*7)) + " week(s) ");
            } else if (datetime > 60*24) {
                setTime(Math.floor(datetime / (60*24)) + " day(s) ");
            } else if (datetime > 60) {
                setTime(Math.floor(datetime / 60) + " hour(s) ");
            } else {
                setTime(datetime + " minute(s) ");
            }


        });

        updateComments();

    }, []);

    const updateComments = () => {
        let user_id = new Cookies().get('session')?.split('\t')[1];

        setCommentLoading(true)
        if (user_id) {
            fetch(`/comments/comments?post=${id}&user_id=${user_id}`).then(r => r.json()).then(r => {
                setComments(r);
                setCommentLoading(false);
            })
        } else {
            fetch(`/comments/comments?post=${id}`).then(r => r.json()).then(r => {
                setComments(r);
                setCommentLoading(false);
            })
        }
    }

    const setResult = (resultPassed) => {
      setData(prev => {
          let pc = prev;
          pc['result'] = resultPassed;
          return pc;
      });
    }


    return (
        <>
            <TopBar title={title} noBottom/>
            <div className={styles.post}>
                {postLoading && <img className={styles.loading} src={loadingImage} alt="loading..."/>}
                {
                    !postLoading
                    &&
                    <div className={styles.container}>
                        {data.result !== undefined && <Votes result={data.result} setResult={setResult} id={id} vote={data.vote}/>}
                        <h1>{data.title}</h1>
                        <p>{time} ago by <span>{data.username}</span></p>
                        <h5>{data.description}</h5>
                        {data.image_url && <img src={data.image_url} alt="image"/>}
                    </div>
                }
                <hr/>
                <div className={styles.container}>
                    <h6>{comments.length} {comments.length > 1 || comments.length === 0 ? 'comments' : 'comment'}</h6>
                    <div className={styles.comments}>
                        {commentLoading && <img className={styles.loading} src={loadingImage} alt="loading..."/>}
                        {comments.map(({text, username, result, comment_id, vote}) => <Comment vote={vote} id={comment_id} username={username} title={text} result={result} />)}
                        <CommentForm post_id={id} update={updateComments} />
                    </div>
                </div>
            </div>
        </>
    )
}

