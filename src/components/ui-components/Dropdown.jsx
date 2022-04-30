import React, {useEffect, useRef} from "react";
import styles from './Dropdown.module.css';

export default function Dropdown({options}) {
        const ref = useRef(null);

        useEffect(() => {
               setTimeout(() => {
                       if (ref !== null) {
                           ref.current.classList.add(styles.open);
                       }
               }, 200);
        })

        return (
            <div className={styles.dropdown} ref={ref}>
                    {options.map(({title, image}) => <DropdownItem title={title} image={image} />)}
            </div>
        )
}

function DropdownItem({title, image}) {
        return (
            <div className={styles.dropdownItem}>
                    <img src={image} alt=""/>
                    <h1>{title}</h1>
            </div>
        )
}
