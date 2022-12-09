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
import StudiosAPIContext, {useStudiosAPIContext} from './Contexts/StudiosAPIContext';
import EnrollmentHistory from "./Components/EnrollmentHistory";
import EnrollClass from "./Components/EnrollClass";
import DropClass from "./Components/DropClass";
import FilterClassInstances from "./Components/FilterClassInstances";

import UserCenter from './Components/UserCenter';
import EditUserInfo from './Components/EditUserInfo';
import AddPaymentMethod from './Components/AddPaymentMethod';
import EditPaymentMethod from './Components/EditPaymentMethod';
import MakeSub from './Components/MakeSub';
import ViewPaymentHistory from './Components/ViewPaymentHistory';
import PaymentHistoryAPIContext, { usePaymentHistoryAPIContext } from './Contexts/PaymentHistoryAPIContext';

import useToken from './useToken';
import useUserId from './useUserId';
import AboutUs from "./Components/AboutUs";
import Studios from './Components/Studios';
// import Classes from './Components/Classes';

function App() {

  const { token, setToken } = useToken();
  const {userId, setUserId} = useUserId();

  const plans = (
    <div>
    <Header />
    <Top_Nav_Menu />
    <PlansAPIContext.Provider value={usePlansAPIContext()}>
      < Plans />
    </PlansAPIContext.Provider>)
    <Footer />
    </div>)
  
  const payments_history = (
    <div>
    <Header />
    <Top_Nav_Menu />
    <PaymentHistoryAPIContext.Provider value={usePaymentHistoryAPIContext()}>
      < ViewPaymentHistory />
    </PaymentHistoryAPIContext.Provider>)
    <Footer />
    </div>)

  const usercenter = (
    <div>
    <Header />
    <Top_Nav_Menu />
    <UserCenter />
    <Footer />
    </div>)

const edituserinfo = (
  <div>
  <Header />
  < EditUserInfo />
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
        <ClassInstances studio_id={3}/>
      </ClassInstancesAPIContext.Provider>
  )
    const aboutUs=(
        <div><div>
            <Header />
            <Top_Nav_Menu />
            <AboutUs />
            <Footer />
        </div>)

        </div>
    )

    const studios = (
      <div>
      <Header />
      <Top_Nav_Menu />
      <StudiosAPIContext.Provider value={useStudiosAPIContext()}>
      <Studios />
    </StudiosAPIContext.Provider>
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
                <Route index element={ main } />
                <Route path="aboutus" element={aboutUs} />
                <Route path="studios" element={studios} />
                <Route path="plans" element={plans} />
                <Route path="usercenter" element={usercenter} />
                <Route path="login" element={<Login setToken={setToken} setUserId = {setUserId} />} />
                <Route path="register" element={<Register />} />
                <Route path="usercenter/edit" element={edituserinfo} />
                <Route path="payment/method/add" element={<AddPaymentMethod />} />
                <Route path="payment/method/edit" element={<EditPaymentMethod />} />
                <Route path="payment/history" element={payments_history} />
                <Route path="/plans/subscribe" element={<MakeSub/> } />
                <Route path="classes/" element={classInstances} />
                <Route path="classes/filter/" element={filterClassInstances}/>
                <Route path="enrollments/" element={enrollmentHistory} />
                <Route path="enroll/" element={<EnrollClass/>} />
                <Route path="drop/" element={<DropClass/>} />

        </Routes>
      </BrowserRouter>
  );

}

export default App;