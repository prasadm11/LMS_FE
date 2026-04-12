import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import AdminDashboard from "../features/auth/pages/AdminDashboard";
import UserDashboard from "../features/auth/pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import AdminBooksPage from "../features/book/admin/pages/AdminBooksPage";
import AdminBorrowDashboard from "../features/borrow/admin/pages/AdminBorrowDashboard";
import UsersPage from "../features/user/pages/UsersPage";
import UserBrowseBooksPage from "../features/book/user/pages/UserBrowseBooksPage";
import UserMyBooksPage from "../features/book/user/pages/UserMyBooksPage";
import UserProfilePage from "../features/user/pages/UserProfilePage";
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
                < AdminBooksPage />
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
              <UserLayout > 
                <UserDashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
                <Route
          path="/user-books"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <UserBrowseBooksPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-borrowed"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <UserMyBooksPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute role="User">
              <UserLayout>
                <UserProfilePage />
              </UserLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
