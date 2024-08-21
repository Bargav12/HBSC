import React from 'react';
import { BsGraphUp, BsFilter} from 'react-icons/bs';
import './Sidebar.css';

function Sidebar({ openSidebarToggle }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <div className='icon_header'>Dashboard</div>
        </div>
      </div>

      <ul className='sidebar-list'>
        {/* Graphs Section */}
        <li className='sidebar-list-item'>
          <BsGraphUp className='icon' /> <div className='side-button'>Visualize Data</div>
        </li>

        {/* Filters Section */}
        <li className='sidebar-list-item'>
          <BsFilter className='icon' /> <div className='side-button'>Transaction Data</div>
        </li>

        
        
      </ul>
    </aside>
  );
}

export default Sidebar;
