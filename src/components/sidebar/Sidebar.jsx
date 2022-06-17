import React, {useEffect, useState} from 'react';
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
import Cookies from 'universal-cookie';
import {Link} from "react-router-dom";
import logout from '../assets/logout.png';
import {Navigate} from "react-router-dom";

export default function Sidebar({}) {
    const [dropdown, setDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const [redirect, setRedirect] = useState(true);
    const [authorized, setAuthorized] = React.useState(false);

    document.addEventListener('authorize', () => {
        const cookies = new Cookies();
        setAuthorized(cookies.get('session') !== undefined);
    })

    const getUsername = () => {
        const cookies = new Cookies();
        let id = cookies.get('session')?.split('\t')[1];
        console.log(id);
        if (!id) {
            return;
        }

        fetch('https://sleepy-plateau-92845.herokuapp.com/user/details', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        }).then(r => r.text()).then(r => {
            console.log(r);
            r = JSON.parse(r);
            setUsername(r.username);
        })
    }

    useEffect(() => {
        document.addEventListener('authorize', getUsername)

        document.addEventListener('dropdownClick', () => {
            setDropdown(false);
        })

        getUsername();

        const cookies = new Cookies();
        setAuthorized(cookies.get('session') !== undefined);

    }, []);

    const handleLogout = () => {
        const cookies = new Cookies();
        cookies.remove('session');
        window.location.replace('/');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const event = new CustomEvent('search', {detail: e.target.value});
            document.dispatchEvent(event);
            window.location.replace('/search?search=' + e.target.value);
        }
    }

    return (
        <>

            <div className={styles.sidebar}>
                <div className={styles.logodiv}>
                    <img src={logo} alt=""/>
                </div>

                <div className={styles.userdiv}>
                    {console.log(username)}
                    <h4>{username === '' ? <Link to={"/signin"} >sign in</Link> : username}</h4>
                    {username !== '' && <img src={dropdown_image} alt="" onClick={() => setDropdown(!dropdown)}
                          style={dropdown ? {transform: "rotate(180deg)"} : {}}/>}
                    {
                        dropdown
                        &&
                        <Dropdown options={[{title: "settings", image: settings, handleClick: () => {
                                const event = new Event('dropdownClick');
                                document.dispatchEvent(event);
                            }}, {title: 'logout', image: logout, handleClick: handleLogout}]} />
                    }
                </div>

                <div className={styles.search} style={dropdown ? {position: 'relative', top: '35px'} : {}}>
                    <img src={search} alt=""/>
                    <input type="text" placeholder="Search..." onKeyDown={handleKeyDown}/>
                </div>

                <div className={styles.options}>
                    <MenuItem image={home} name="Home" linkTo={"/home"} />
                    {authorized && <MenuItem image={subreddits} name="My subreddits" linkTo={"/subreddits"}/>}
                </div>
            </div>
        </>
    )
}
