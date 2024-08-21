import React from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';
import Footer from './components/footer/Footer';
// import Calculation from './components/dashboard/Calculation';

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
       
        <Dashboard/>
        <Footer/>
      </div>
      
    </div>
  );
};

export default App;
