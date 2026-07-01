import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import Food from "./pages/Food";
import Travel from "./pages/Travel";
import Health from "./pages/Health";
import Others from "./pages/Others";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/food" element={<Food />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/health" element={<Health />} />
        <Route path="/others" element={<Others />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;