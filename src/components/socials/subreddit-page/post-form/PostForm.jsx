import React, {useState} from 'react';
import styles from './PostForm.module.css';
import '../../../InputStyle.css';
import Cookies from "universal-cookie";

export default function PostForm({cancel, subreddit_id}) {

    const [post, setPost] = useState({title: '', description: '', image_url: ''})

    const handleChange = (event) => {
        let value = event.target.value;

        switch(event.target.id) {
            case 'username':
                setPost(prev => {
                    return {
                        title: value,
                        description: prev.description,
                        image_url: prev.image_url
                    }
                })
                break;

            case 'description':
                setPost(prev => {
                    return {
                        title: prev.title,
                        description: value,
                        image_url: prev.image_url
                    }
                })
                break;

            case 'image':
                setPost(prev => {
                    return {
                        title: prev.title,
                        description: prev.description,
                        image_url: value
                    }
                })
                break;
        }
    }

    const handleSubmit = () => {
        let title = post.title;
        let description = post.description;
        let image_url = post.image_url;
        let poster_id = new Cookies().get('session').split('\t')[1];

        fetch('/posts/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, image_url: image_url === '' ? null : image_url, poster_id: poster_id, subreddit_id: subreddit_id})
        }).then(r => r.json()).then(r => {
            console.log(r);
            const event = new Event('post');
            document.dispatchEvent(event);
        })
    }

    return (
        <div className={styles.form}>
            <div className="form__group field" style={{width: '40%'}}>
                <input autoComplete="off" id="username" type="text" className="form__field" placeholder={"Username..."} onChange={handleChange} />
                <label htmlFor="username" className="form__label">title</label>
            </div>
            <div className="form__group field" style={{width: '60%'}}>
                <input autoComplete="off" id="description" type="text" className="form__field" placeholder={"Username..."} onChange={handleChange} />
                <label htmlFor="description" className="form__label">description</label>
            </div>
            <div className="form__group field" style={{width: '70%'}}>
                <input autoComplete="off" id="image" type="url" className="form__field" placeholder={"Username..."} onChange={handleChange} />
                <label htmlFor="image" className="form__label">image url (optional)</label>
            </div>

            <button className={styles.cancel} onClick={cancel}>cancel</button>
            <button disabled={post.title === '' || post.description === ''} onClick={handleSubmit}>post</button>
        </div>
    )
}
