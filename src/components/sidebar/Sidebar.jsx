import React from 'react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';
import dropdown from '../assets/dropdown.svg';
import search from '../assets/search.svg';
import MenuItem from "./menu-item/MenuItem";
import home from '../assets/home.svg';
import notifs from '../assets/notifications.svg';
import subreddits from '../assets/my_subbreddits.svg';

export default function Sidebar({}) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.logodiv}>
                <img src={logo} alt=""/>
            </div>

            <div className={styles.userdiv}>
                <h4>the_guy_with_cool_pens</h4>
                <img src={dropdown} alt=""/>
            </div>
            <div className={styles.search}>
                <img src={search} alt=""/>
                <input type="text" placeholder="Search..."/>
            </div>

            <div className={styles.options}>
                <MenuItem image={home} name="Home"/>
                <MenuItem image={notifs} name="Notifications"/>
                <MenuItem image={subreddits} name="My subreddits"/>
            </div>
        </div>
    )
}
