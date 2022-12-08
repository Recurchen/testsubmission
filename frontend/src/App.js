import logo from './logo.svg';
import './App.css';

import Header from './Components/header'
import Main_View from './Components/main_view';
import Top_Nav_Menu from './Components/top_nav_menu';
import Footer from './Components/footer';

import React from 'react';

import Login from "./Components/Login";
import Register from './Components/Register';
import Plans from './Components/Plans';
import PlansAPIContext, {usePlansAPIContext} from './Contexts/PlansAPIContext';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ClassInstances from "./Components/ClassInstances";
import ClassInstancesAPIContext, {useClassInstanceAPIContext} from "./Contexts/ClassInstancesAPIContext";
import EnrollmentHistoryAPIContext, {useEnrollmentHistoryAPIContext} from "./Contexts/EnrollmentHistoryAPIContext";
import EnrollmentHistory from "./Components/EnrollmentHistory";
import EnrollClass from "./Components/EnrollClass";
import DropClass from "./Components/DropClass";
import FilterClassInstances from "./Components/FilterClassInstances";

import UserCenter from './Components/UserCenter';

import useToken from './useToken';
import useUserId from './useUserId';

function App() {

  const { token, setToken } = useToken();
  const {userId, setUserId} = useUserId();

  const plans = (
    <div>
    <Header />
    <PlansAPIContext.Provider value={usePlansAPIContext()}>
      < Plans />
    </PlansAPIContext.Provider>)
    <Footer />
    </div>)

  const usercenter = (
    <div>
    <Header />
    < UserCenter />
    <Footer />
    </div>)
   
   const enrollmentHistory = (
        <EnrollmentHistoryAPIContext.Provider value={useEnrollmentHistoryAPIContext() }>
            <EnrollmentHistory />
        </EnrollmentHistoryAPIContext.Provider>
    )
    const filterClassInstances = (
        <ClassInstancesAPIContext.Provider value={useClassInstanceAPIContext()}>
            <FilterClassInstances />
        </ClassInstancesAPIContext.Provider>
    )
    const classInstances = (
      <ClassInstancesAPIContext.Provider value={useClassInstanceAPIContext()}>
        <ClassInstances />
      </ClassInstancesAPIContext.Provider>
  )
   
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
                <Route path="usercenter" element={usercenter} />
                <Route path="login" element={<Login setToken={setToken} setUserId = {setUserId} />} />
                <Route path="register" element={<Register />} />
                
                <Route path="classes/" element={classInstances} />
                <Route path="classes/filter/" element={filterClassInstances}/>
                <Route path="enrollments/" element={enrollmentHistory} />
                <Route path="enroll/" element={<EnrollClass/>} />
                <Route path="drop/" element={<DropClass/>} />
                {/* <Route path="players" element={players} /> */}
            {/* </Route> */}
        </Routes>
      </BrowserRouter>
  );

}

export default App;