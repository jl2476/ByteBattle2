// Layout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/puzzle">Puzzle</Link> | 
        <Link to="/code">Code</Link>
      </nav>
      <Outlet /> 
    </div>
  );
};

export default Layout;
