import React from 'react';
import './App.css';
import ClassInstances from "./Components/ClassInstances";
import ClassInstancesAPIContext, {useClassInstanceAPIContext} from "./Contexts/ClassInstancesAPIContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FilterClassInstances from "./Components/FilterClassInstances";
import Layout from "./Components/Layout";
import EnrollmentHistoryAPIContext, {useEnrollmentHistoryAPIContext} from "./Contexts/EnrollmentHistoryAPIContext";
import EnrollmentHistory from "./Components/EnrollmentHistory";
import EnrollClass from "./Components/EnrollClass";
import DropClass from "./Components/DropClass";



import Header from './components/header'
import Main_View from './components/main_view';
import Top_Nav_Menu from './components/top_nav_menu';
import Footer from './components/footer';

import React from 'react';

import Login from "./components/Login";
import Register from './components/Register';
import Plans from './components/Plans';
import PlansAPIContext, {usePlansAPIContext} from './Context/PlansAPIContext';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  
  const plans = (
    <div>
    <Header />
    <PlansAPIContext.Provider value={usePlansAPIContext()}>
      < Plans />
    </PlansAPIContext.Provider>)
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
      <Header />

      <Top_Nav_Menu />

      <Main_View />
      
      <Footer />
    </div>)
      
    return(
      <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
                <Route index element={main} />
                <Route path="plans" element={plans} />
                <Route path="login" element={<Login />} />
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