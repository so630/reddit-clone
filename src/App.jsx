import React from 'react';
import Sidebar from "./components/sidebar/Sidebar";
import TopBar from "./components/topbar/TopBar";
import {BrowserRouter as Router, Routes, Route, Switch, BrowserRouter} from "react-router-dom";
import MainPage from "./components/posts-homepage/MainPage/MainPage";
import Subreddits from "./components/posts-homepage/SubredditsPage/Subreddits";
import Signup from "./components/Authentication/Signup";
import Signin from './components/Authentication/Signin';
import Settings from "./components/user-details/Settings";


export default function App() {

    const [authorized, setAuthorized] = React.useState(false);

    document.addEventListener('authorize', () => {
        setAuthorized(true);
    })

  return (
      <BrowserRouter>
          <Sidebar />
          <Routes>
              <Route path={"/signin"} element={<Signin />} />
              <Route path={"/"} element={<Signup />}/>
              {authorized &&
                  [<Route path={"/settings"} element={<Settings />} />,
                  <Route path={"/home"} element={<MainPage />} />,
                  <Route path={"/subreddits"} element={<Subreddits />}/>]
              }
          </Routes>
      </BrowserRouter>
  )
}
