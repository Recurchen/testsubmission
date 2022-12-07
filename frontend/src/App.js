import logo from './logo.svg';
import './App.css';

import Header from './components/header'
import Main_View from './components/main_view';
import Top_Nav_Menu from './components/top_nav_menu';
import Footer from './components/footer';

import React, { useState } from 'react';

import Login from "./components/Login";
import Register from './components/Register';
import Plans from './components/Plans';
import PlansAPIContext, {usePlansAPIContext} from './Context/PlansAPIContext';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import useToken from './useToken';

function App() {

  const { token, setToken } = useToken();

  const plans = (
    <div>
    <Header />
    <PlansAPIContext.Provider value={usePlansAPIContext()}>
      < Plans />
    </PlansAPIContext.Provider>)
    <Footer />
    </div>)
  
  const main = (  
    <div className="MainDiv">
      
      {/* Header: the top most section */}
      <Header/>

      <Top_Nav_Menu />

      <Main_View />
      
      <Footer />
    </div>)
   
      return(
      <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
                <Route index element={ main } />
                <Route path="plans" element={plans} />
                <Route path="login" element={<Login setToken={setToken} />} />
                <Route path="register" element={<Register />} />
                {/* <Route path="players" element={players} /> */}
            {/* </Route> */}
        </Routes>
      </BrowserRouter>
  );}

export default App;