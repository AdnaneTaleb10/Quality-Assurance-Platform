import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Evaluation from "./pages/Evaluation";
import User_Management from "./pages/User_management";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/userManagement" element={<User_Management />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;