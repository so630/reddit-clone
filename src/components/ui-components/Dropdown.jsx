import React, {useEffect, useRef} from "react";
import styles from './Dropdown.module.css';
import {Link} from "react-router-dom";

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
                    {options.map(({title, image, handleClick}) => <DropdownItem title={title} image={image} handleClick={handleClick} linkTo={title === 'settings' && "/settings"} />)}
            </div>
        )
}

function DropdownItem({title, image, handleClick, linkTo}) {
        if (linkTo) {
            return (
                <Link to={linkTo}>
                    <div className={styles.dropdownItem} onClick={handleClick}>
                        <img src={image} alt=""/>
                        <h1>{title}</h1>
                    </div>
                </Link>
            )
        } else {
            return (
                <div className={styles.dropdownItem} onClick={handleClick}>
                    <img src={image} alt=""/>
                    <h1>{title}</h1>
                </div>
            )
        }
}
