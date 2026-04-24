import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardPage from "./pages/Dashboardpage";
import ValidationPage from "./pages/ValidationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<DashboardPage />} />
          <Route path="/validation" element={<ValidationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
