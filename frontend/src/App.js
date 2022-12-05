import React from 'react';
import './App.css';
import ClassInstances from "./Components/ClassInstances";
import ClassInstancesAPIContext, {useAPIContext} from "./Contexts/ClassInstancesAPIContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FilterClassInstances from "./Components/FilterClassInstances";
import Layout from "./Components/Layout";



function App() {
    const filterClassInstances = (
        <ClassInstancesAPIContext.Provider value={useAPIContext()}>
            <FilterClassInstances />
        </ClassInstancesAPIContext.Provider>
    )
  const classInstances = (
      <ClassInstancesAPIContext.Provider value={useAPIContext()}>
        <ClassInstances />
      </ClassInstancesAPIContext.Provider>
  )

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<ClassInstances />} />
                  <Route path="/ClassInstances" element={classInstances} />
                  <Route path="/ClassInstances/filter" element={filterClassInstances}/>
              </Route>
          </Routes>
      </BrowserRouter>


  )
}

export default App;
