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



function App() {
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
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<ClassInstances />} />
                  <Route path="classes/" element={classInstances} />
                  <Route path="classes/filter/" element={filterClassInstances}/>
                  <Route path="enrollments/" element={enrollmentHistory} />
                  <Route path="enroll/" element={<EnrollClass/>} />
                  <Route path="drop/" element={<DropClass/>} />

              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App;
