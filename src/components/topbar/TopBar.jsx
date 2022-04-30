import React from "react";
import styles from './TopBar.module.css';
import MenuItem from "./menu-item/MenuItem";

export default function TopBar() {
    return (
        <div className={styles.topbar}>
            <h1>All Subreddits</h1>
            <div className={styles.menubar}>
                <MenuItem name="NEW" selected />
                <MenuItem name="HOT" />
                <MenuItem name="TOP" />
            </div>
        </div>
    )
}
