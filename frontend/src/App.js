import React from 'react';
import './App.css';
import ClassInstances from "./Components/ClassInstances";
import APIContext, {useAPIContext} from "./Contexts/ClassInstancesAPIContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FilterClassInstances from "./Components/FilterClassInstances";
import Layout from "./Components/Layout";


function App() {
  const classInstances = (
      <APIContext.Provider value={useAPIContext()}>
        <ClassInstances />
      </APIContext.Provider>
  )

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<ClassInstances />} />
                  <Route path="/ClassInstances" element={classInstances} />
                  <Route path="/ClassInstances/filter" element={<FilterClassInstances />}/>
              </Route>
          </Routes>
      </BrowserRouter>


  )
}

export default App;
