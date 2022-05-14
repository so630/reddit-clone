import React, {useEffect, useState} from "react";
import styles from './MenuItem.module.css';
import {Link, NavLink, useLocation} from "react-router-dom";

export default function MenuItem({name, image, selected, linkTo}) {
    const [clicked, setClicked] = useState(false);
    const customEvent = new CustomEvent('selection', {detail: name});
    const loc = useLocation();

    useEffect(() => {
        document.addEventListener('selection', (details) => {
            if (details.detail !== name) {
                console.log(details.detail, name);
                setClicked(false);
            }
        })

        document.addEventListener('dropdownClick', () => {
            setClicked(false);
        })

        if (name === 'Home') {
            if (loc.pathname === '/home') {
                setClicked(true);
                document.dispatchEvent(customEvent);
            }
        } else if (name === 'My subreddits') {
            if (loc.pathname === '/subreddits') {
                setClicked(true);
                document.dispatchEvent(customEvent);
            }
        }
    }, [])

    return (
        <NavLink to={linkTo ? linkTo : ""} className={({isActive}) => {
            if (isActive) {
                setClicked(true);
            }
            return "sussy";
        }}>
            <div className={styles.menuitem} onClick={() => {
                setClicked(true);
                document.dispatchEvent(customEvent);
            }}>
                <img unselectable="on" src={image} alt="" className={clicked && styles.clicked}/>
                <h3 className={clicked && styles.clicked} unselectable="on">{name}</h3>
            </div>
        </NavLink>
    )
}
