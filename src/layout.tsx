import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <h1>Memory Game</h1>
      {children}
    </div>
  );
};

export default Layout;
