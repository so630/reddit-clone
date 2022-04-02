import React, {useState} from "react";
import styles from './MenuItem.module.css';

export default function MenuItem({name, image}) {
    const [clicked, setClicked] = useState(false);
    const customEvent = new CustomEvent('selection', {detail: name});

    document.addEventListener('selection', (details) => {
        if (details.detail !== name) {
            setClicked(false);
        }
    })

    return (
        <div className={styles.menuitem} onClick={() => {
            setClicked(!clicked);
            document.dispatchEvent(customEvent);
        }}>
            <img unselectable="on" src={image} alt="" className={clicked && styles.clicked}/>
            <h3 className={clicked && styles.clicked} unselectable="on">{name}</h3>
        </div>
    )
}
