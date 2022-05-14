import React, {useEffect} from 'react';
import Sidebar from "./components/sidebar/Sidebar";
import TopBar from "./components/topbar/TopBar";
import {BrowserRouter as Router, Routes, Route, Switch, BrowserRouter, Navigate} from "react-router-dom";
import MainPage from "./components/posts-homepage/MainPage/MainPage";
import Subreddits from "./components/posts-homepage/SubredditsPage/Subreddits";
import Signup from "./components/Authentication/Signup";
import Signin from './components/Authentication/Signin';
import Settings from "./components/user-details/Settings";
import Cookies from 'universal-cookie';
import Subreddit from "./components/socials/subreddit-page/Subreddit";
import SearchResults from './components/search/SearchResults';
import Post from "./components/socials/post-page/Post";


export default function App() {

    const [authorized, setAuthorized] = React.useState(false);

    document.addEventListener('authorize', () => {
        const cookies = new Cookies();
        setAuthorized(cookies.get('session') !== undefined);
    })

    useEffect(() => {
        const cookies = new Cookies();
        setAuthorized(cookies.get('session') !== undefined);
    }, [])

  return (
      <BrowserRouter>
          <Sidebar />
          <Routes>
              <Route path={"/signin"} element={<Signin />} />
              <Route path={"/"} element={<Signup />}/>
              {authorized &&
                  [<Route path={"/settings"} element={<Settings />} />,
                  <Route path={"/subreddits"} element={<Subreddits />}/>]
              }
              {
                  !authorized &&
                  [
                      <Route path={"/settings"} element={<Redirect />} />,
                      <Route path={"/subreddits"} element={<Redirect />} />
                  ]
              }
              <Route path={"/r/:id"} element={<Subreddit />} />
              <Route path={"/search"} element={<SearchResults />}/>
              <Route path={"/p/:id"} element={<Post />} />
              <Route path={"/home"} element={<MainPage />} />
          </Routes>
      </BrowserRouter>
  )
}

function Redirect() {
    useEffect(() => {
        window.location.replace('/home')
    }, []);

    return (
        <p>you are not authorised sign in brug</p>
    )
}
