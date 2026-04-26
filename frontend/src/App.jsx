// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protectedroute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboardPage from "./pages/Dashboardpage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ValidationPage from "./pages/ValidationPage";
import UsersPage from "./pages/UserPage";
import UserAnswersReviewPage from "./pages/UserAnswersReviewPage";
import UserSubmissionsPage from "./pages/UserSubmissionsPage";
import EvaluationPage from "./pages/Evaluation";
import EvaluationDone from "./pages/EvaluationDone";
import MyAnswersPage from "./pages/MyAnswers";
import UserManagementContent from "./pages/User_management";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
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

        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute>
              <UserManagementContent />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Evaluation */}
        <Route
          path="/evaluation/done"
          element={
            <ProtectedRoute>
              <EvaluationDone />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluation/:questionId"
          element={
            <ProtectedRoute>
              <EvaluationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-answers"
          element={
            <ProtectedRoute>
              <MyAnswersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
