{
  /* 
  Authors: 
  - Le Luu Phuoc Thinh
  - Nguyen Thi Thanh Minh
  - Nguyen Quy Hung
  - Vo Thi Kim Huyen
  - Dinh Danh Nam

  Group 3 - COS30049
*/
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/DashBoard";
import NavigationBar from "./components/NavigationBar";
import "./App.css";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
