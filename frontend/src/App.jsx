// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Protectedroute";

import Landing               from "./pages/Landing";
import Login                 from "./pages/Login";
import Signup                from "./pages/Signup";
import AdminDashboardPage    from "./pages/Dashboardpage";
import UserDashboardPage     from "./pages/UserDashboardPage";
import ValidationPage        from "./pages/ValidationPage";
import UsersPage             from "./pages/UserPage";
import UserAnswersReviewPage from "./pages/UserAnswersReviewPage";
import UserSubmissionsPage   from "./pages/UserSubmissionsPage";
import EvaluationPage        from "./pages/Evaluation";
import EvaluationDone        from "./pages/EvaluationDone";
import MyAnswersPage         from "./pages/MyAnswers";
import UserManagementContent from "./pages/User_management";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ──────────────────────────────────────────────────── */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Admin only ──────────────────────────────────────────────── */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requireAdminOrRector>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* User Management — Admin can edit/delete, Rector read-only */}
        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute requireAdminOrRector>
              <UserManagementContent />
            </ProtectedRoute>
          }
        />

        {/* ── Admin + Rector (read-only for Rector) ───────────────────── */}
        {/* Validation queue — Rector sees it but can't approve/reject */}
        <Route
          path="/validation"
          element={
            <ProtectedRoute requireAdminOrRector>
              <ValidationPage />
            </ProtectedRoute>
          }
        />
        {/* Users list */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdminOrRector>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        {/* Per-user pending answers — Rector sees but cannot approve/reject */}
        <Route
          path="/admin/users/:userId/answers/pending"
          element={
            <ProtectedRoute requireAdminOrRector>
              <UserAnswersReviewPage />
            </ProtectedRoute>
          }
        />
        {/* Per-user all submissions */}
        <Route
          path="/admin/users/:userId/submissions"
          element={
            <ProtectedRoute requireAdminOrRector>
              <UserSubmissionsPage />
            </ProtectedRoute>
          }
        />

        {/* ── Any authenticated user ───────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
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