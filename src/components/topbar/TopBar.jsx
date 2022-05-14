import React from "react";
import styles from './TopBar.module.css';
import MenuItem from "./menu-item/MenuItem";

export default function TopBar({title, noBottom}) {
    return (
        <div className={styles.topbar} style={{background: noBottom && 'white', height: noBottom && '60px'}}>
            <h1>{!title ? 'All Subreddits' : title}</h1>
            {
                !noBottom
                &&
                <div className={styles.menubar}>
                    <MenuItem name="NEW" selected/>
                    <MenuItem name="HOT"/>
                    <MenuItem name="TOP"/>
                </div>
            }
        </div>
    )
}
