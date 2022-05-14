import React, {useState} from "react";
import styles from "./Authentication.module.css";
import "../InputStyle.css";
import {Link, Navigate} from "react-router-dom";
import Cookies from 'universal-cookie';

export default function Signin() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = () => {
        fetch('/auth/sign-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: password, email: email})
        }).then(r => r.json()).then(r => {
            if (!r.result) {
                window.location.reload();
                return;
            }
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
                <h1>sign in</h1>

                <div className="form__group field">
                    <input autoComplete="off" id="username" type="email" className="form__field" placeholder={"Username..."} onChange={(event) => {setEmail(event.target.value)}}/>
                    <label htmlFor="username" className="form__label">email</label>
                </div>
                <div className="form__group field">
                    <input autoComplete="off" id="password" type="password" className="form__field" placeholder={"Username..."} onChange={(event) => {setPassword(event.target.value)}}/>
                    <label htmlFor="password" className="form__label">password</label>
                </div>

                <button disabled={password === '' || email === ''} onClick={handleSubmit}>sign in</button>
                <p>not registered? <Link to="/">sign up</Link></p>
            </div>
        </div>
    )
}
