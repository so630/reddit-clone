import React, {useEffect, useState} from "react";
import styles from './Post.module.css'
import TopBar from "../../topbar/TopBar";
import arrow_nofill from '../../assets/arrow_nofill.svg';
import Cookies from "universal-cookie";
import {Link, useParams} from "react-router-dom";
import AnimatedNumber from "react-animated-numbers";
import Votes from "../../cards-global/Votes";

export default function Post() {

    const {id} = useParams();
    const [data, setData] = useState({});
    const [time, setTime] = useState('');

    let title = <Link to={`/r/${data.subreddit_id}`}><span style={{color: "#FF4500"}}>/r/</span><span style={{color: "#000"}}>{data.name}</span></Link>;

    useEffect(() => {
        fetch(`/posts/post?id=${id}&user=${new Cookies().get('session')?.split('\t')[1]}`).then(r => r.json()).then(r => {
            console.log(r);
            setData(r[0]);

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
    }, []);

    const setResult = (resultPassed) => {
      setData(prev => {
          let pc = prev;
          pc['result'] = resultPassed;
          setTimeout(() => {
              console.log(data);
          }, 3000);
          return pc;
      });
    }


    return (
        <>
            <TopBar title={title} noBottom/>
            <div className={styles.post}>
                <div className={styles.container}>
                    {data.result !== undefined && <Votes result={data.result} setResult={setResult} id={id} vote={data.vote}/>}
                    <h1>{data.title}</h1>
                    <p>{time} ago by <span>{data.username}</span></p>
                    <h5>{data.description}</h5>
                    {data.image_url && <img src={data.image_url} alt="image"/>}
                </div>
            </div>
        </>
    )
}
