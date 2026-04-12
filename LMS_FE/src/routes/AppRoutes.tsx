import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import AdminDashboard from "../features/auth/pages/AdminDashboard";
import UserDashboard from "../features/auth/pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import BooksPage from "../features/book/pages/BooksPage";
import AdminBorrowDashboard from "../features/borrow/admin/pages/AdminBorrowDashboard";
import UsersPage from "../features/user/pages/UsersPage";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        {/* Private Routes (we will protect later) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-books"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                < BooksPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-borrow"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <AdminBorrowDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute role="Admin">
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        Route
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
