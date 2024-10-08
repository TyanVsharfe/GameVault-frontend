import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import reportWebVitals from './reportWebVitals';

import Navigation from "./components/Navigation";
import Main from "./components/Main";
import AccountGames from "./components/account/AccountGames";
import Search from "./components/search/Search";
import Game from "./components/game/Game";

//import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountSettings from "./components/account/AccountSettings";
import Account from "./components/account/Account";
import FranchiseGames from "./components/game/FranchiseGames";
import FranchiseInfo from "./components/game/FranchiseInfo";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Navigation />
          <Routes>
              <Route path="/main" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/games" element={<AccountGames />} />
              <Route path="/account/settings" element={<AccountSettings />} />
              <Route path="/game/*" element={<Game />} />
              <Route path="/series/*" element={<FranchiseInfo />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
