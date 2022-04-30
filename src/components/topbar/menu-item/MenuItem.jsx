import React, {useState} from "react";
import styles from './MenuItem.module.css';

export default function MenuItem({name, selected}) {
    const [clicked, setClicked] = useState(selected);
    const customEvent = new CustomEvent('selection-topbar', {detail: name});

    document.addEventListener('selection-topbar', (details) => {
        if (details.detail !== name) {
            setClicked(false);
        }
    })

    return (
        <div className={styles.option + ' ' + (clicked && styles.selected)} onClick={() => {
            setClicked(true)
            document.dispatchEvent(customEvent);
        }}>
            <h1>{name}</h1>
            <hr/>
        </div>
    )
}
