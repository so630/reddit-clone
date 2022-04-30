import React from 'react';
import Sidebar from "./components/sidebar/Sidebar";
import TopBar from "./components/topbar/TopBar";
import {BrowserRouter as Router, Routes, Route, Switch, BrowserRouter} from "react-router-dom";
import MainPage from "./components/posts-homepage/MainPage/MainPage";
import Subreddits from "./components/posts-homepage/SubredditsPage/Subreddits";


export default function App() {
  return (
      <BrowserRouter>
          <Sidebar />
          <Routes>
              <Route path={"/home"} element={<MainPage />} />
              <Route path={"/subreddits"} element={<Subreddits />}/>
          </Routes>
      </BrowserRouter>
  )
}
