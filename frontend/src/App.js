import logo from './logo.svg';
import './App.css';

import Header from './components/header'
import Main_View from './components/main_view';
import Top_Nav_Menu from './components/top_nav_menu';
import Footer from './components/footer';

import React from 'react';

class App extends React.Component {
  
  render() {
   
    return (
    
      <div className="MainDiv">
        
        {/* Header: the top most section */}
        <Header />

        <Top_Nav_Menu />

        <Main_View />
        
        <Footer />

      </div>
)
};

export default App;