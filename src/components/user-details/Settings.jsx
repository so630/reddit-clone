import React, {useEffect, useState} from "react";
import styles from "../Authentication/Authentication.module.css";
import "../InputStyle.css";
import Cookies from "universal-cookie";
import loadingsvg from '../assets/loading.svg';

export default function Settings() {
    const [initial, setInitial] = useState({username: '', email: '', avatar: ''});
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    const cookies = new Cookies();
    let id = cookies.get('session')?.split('\t')[1];

    const handleSubmit = () => {
        setLoading(true)
        fetch('https://sleepy-plateau-92845.herokuapp.com/user/edit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, email: email, id: id, avatar: avatar})
        }).then(r => r.json()).then(r => {
            setLoading(false);
            setInitial({
                title: r[0].username,
                avatar: r[0].avatar,
                email: r[0].email
            });
        })
    }

    useEffect(() => {

        if (!id) {
            return;
        }

        fetch('https://sleepy-plateau-92845.herokuapp.com/user/details', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        }).then(r => r.text()).then(r => {
            r = JSON.parse(r);
            setUsername(r.username);
            setEmail(r.email);
            let avatar_id = r.avatar_id;

            setInitial(prev => {
                return {
                    title: r.username,
                    email: r.email,
                    avatar: prev.avatar
                }
            })

            fetch('https://sleepy-plateau-92845.herokuapp.com/user/avatar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: avatar_id})
            }).then(r => r.json()).then(r => {
                setAvatar(r.image_url);
                setInitial(prev => {
                    return {
                        title: prev.username,
                        email: prev.email,
                        avatar: r.image_url
                    }
                })
            })
        })
    }, []);


    return (
        <div>
            <div className={styles.form}>
                <div>
                    <h1>edit your profile</h1>
                    <div className="form__group field">
                        <input autoComplete="off" id="username" defaultValue={username} type="text" className="form__field" placeholder={"Username..."} onChange={(event) => {setUsername(event.target.value)}}/>
                        <label htmlFor="username" className="form__label">username</label>
                    </div>

                    <div className="form__group field">
                        <input autoComplete="off" id="email" type="email" defaultValue={email} className="form__field" placeholder={"Username..."} onChange={(event) => {
                            setEmail(event.target.value)
                        }}/>
                        <label htmlFor="email" className="form__label">email</label>
                    </div>
                    <div className="form__group field">
                        <input autoComplete="off" id="avatar-url" type="url" className="form__field" defaultValue={avatar} placeholder={"Username..."} onChange={(event) => {setAvatar(event.target.value)}}/>
                        <label htmlFor="avatar-url" className="form__label">avatar url</label>
                    </div>
                    {!loading ? <button
                        disabled={(username === initial.username && email === initial.email && avatar === initial.avatar)}
                        onClick={handleSubmit}>edit</button> : <img style={{width: '54px', height: '44px', marginTop: '40px', borderRadius: '5px'}} src={loadingsvg} alt=""/>}

                </div>
            </div>
        </div>
    )
}
