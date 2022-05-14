import React, {useState} from "react";
import styles from "./Authentication.module.css";
import "../InputStyle.css";
import {Link, Navigate} from "react-router-dom";
import Cookies from "universal-cookie";

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');

    const [redirect, setRedirect] = useState(false);

    const handleSubmit = () => {
        fetch('/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: password, email: email, avatar: avatar, username: username})
        }).then(r => r.text()).then(r => {
            r = JSON.parse(r);

            const cookies = new Cookies();
            cookies.set('session', r.hash + '\t' + r.id, { path: '/', maxAge: 2*60*60 });

            fetch('/auth/authorize', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({hash: cookies.get('session').split('\t')[0], id: cookies.get('session').split('\t')[1]})
            }).then(r => r.text()).then(r => {
                r = JSON.parse(r);
                if (r.auth) {
                    setRedirect(true);
                    const event = new Event('authorize');
                    document.dispatchEvent(event);
                }
            })
        })
    }

    if (redirect) {
        return <Navigate to={"/home"} />
    }

    return (
        <div className={styles.form}>
            <div>
                <h1>sign up</h1>
                <div className="form__group field">
                    <input autoComplete="off" id="username" type="text" className="form__field" placeholder={"Username..."} onChange={(event) => {setUsername(event.target.value)}}/>
                    <label htmlFor="username" className="form__label">username</label>
                </div>

                <div className="form__group field">
                    <input autoComplete="off" id="email" type="email" className="form__field" placeholder={"Username..."} onChange={(event) => {setEmail(event.target.value)}}/>
                    <label htmlFor="email" className="form__label">email</label>
                </div>
                <div className="form__group field">
                    <input autoComplete="off" id="password" type="password" className="form__field" placeholder={"Username..."} onChange={(event) => {setPassword(event.target.value)}}/>
                    <label htmlFor="password" className="form__label">password</label>
                </div>
                <div className="form__group field">
                    <input autoComplete="off" id="avatar-url" type="url" className="form__field" placeholder={"Username..."} onChange={(event) => {setAvatar(event.target.value)}}/>
                    <label htmlFor="avatar-url" className="form__label">avatar url</label>
                </div>

                <button disabled={username === '' || password === '' || email === '' || avatar === '' || username.includes(' ')} onClick={handleSubmit}>sign up</button>
                <p>already registered? <Link to="/signin">sign in</Link></p>
            </div>
        </div>
    )
}
