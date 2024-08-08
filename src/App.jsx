import React from "react";
import Home from "./Pages/Home";
import Employee from "./Pages/Employee";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Salary from "./Pages/Salary";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Employee" element={<Employee />} />
        <Route path="/Salary" element={<Salary />} />
      </Routes>
    </Router>
  );
};

export default App;
