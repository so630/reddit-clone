import React, {useState} from "react";
import styles from './MenuItem.module.css';
import {Link, NavLink} from "react-router-dom";

export default function MenuItem({name, image, selected, linkTo}) {
    const [clicked, setClicked] = useState(selected);
    const customEvent = new CustomEvent('selection', {detail: name});

    document.addEventListener('selection', (details) => {
        if (details.detail !== name) {
            setClicked(false);
        }
    })

    document.addEventListener('dropdownClick', () => {
        setClicked(false);
    })

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
