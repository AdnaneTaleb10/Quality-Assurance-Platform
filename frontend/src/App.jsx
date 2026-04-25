import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Evaluation from "./pages/Evaluation";
import MyAnswers from "./pages/MyAnswers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/myAnswers" element={<MyAnswers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;