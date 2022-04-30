import React from 'react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';
import dropdown_image from '../assets/dropdown.svg';
import search from '../assets/search.svg';
import MenuItem from "./menu-item/MenuItem";
import home from '../assets/home.svg';
import notifs from '../assets/notifications.svg';
import subreddits from '../assets/my_subbreddits.svg';
import Dropdown from "../ui-components/Dropdown";
import settings from "../assets/settings.png";

export default function Sidebar({}) {
    const [dropdown, setDropdown] = React.useState(false);

    return (
        <>

            <div className={styles.sidebar}>
                <div className={styles.logodiv}>
                    <img src={logo} alt=""/>
                </div>

                <div className={styles.userdiv}>
                    <h4>the_guy_with_cool_pens</h4>
                    <img src={dropdown_image} alt="" onClick={() => setDropdown(!dropdown)} style={dropdown ? {transform: "rotate(180deg)"} : {}}/>
                    {
                        dropdown
                        &&
                        <Dropdown options={[{title: "settings", image: settings}]} />
                    }
                </div>

                <div className={styles.search} style={dropdown ? {position: 'relative', top: '35px'} : {}}>
                    <img src={search} alt=""/>
                    <input type="text" placeholder="Search..."/>
                </div>

                <div className={styles.options}>
                    <MenuItem image={home} name="Home" linkTo={"/home"} />
                    <MenuItem image={subreddits} name="My subreddits" linkTo={"/subreddits"}/>
                </div>
            </div>
        </>
    )
}
