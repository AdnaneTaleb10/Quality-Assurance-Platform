// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protectedroute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardPage from "./pages/Dashboardpage";
import ValidationPage from "./pages/ValidationPage";
import UsersPage from "./pages/UserPage";
import UserAnswersReviewPage from "./pages/UserAnswersReviewPage";
import UserSubmissionsPage from "./pages/UserSubmissionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin — all wrapped in ProtectedRoute */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/validation"
          element={
            <ProtectedRoute>
              <ValidationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId/answers/pending"
          element={
            <ProtectedRoute>
              <UserAnswersReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId/submissions"
          element={
            <ProtectedRoute>
              <UserSubmissionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;