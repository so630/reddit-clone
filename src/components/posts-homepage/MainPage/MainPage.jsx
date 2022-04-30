import React from "react";
import TopBar from "../../topbar/TopBar";
import styles from './MainPage.module.css';
import PostCard from "../../cards-global/post-card/PostCard";

export default function MainPage() {
    return (
        <>
            <TopBar />
            <div className={styles.posts_container}>
                <div style={{display: 'inline-block'}}>
                    <PostCard image={'https://cdn.britannica.com/33/4833-004-828A9A84/Flag-United-States-of-America.jpg'} title={"13 years ago today, a true patriot lost his life. Rest in Peace big guy"} user={"the_big_mothergoose"} subreddit={"MURICA"} />
                </div>
            </div>
        </>
    )
}
