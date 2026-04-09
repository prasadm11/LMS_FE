import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = getUserFromToken();


  const username = user?.decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User"


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
      ? "bg-white/10 text-white"
      : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-black text-white">

      {/* SIDEBAR */}
      <div
        className={`${collapsed ? "w-20" : "w-60"
          } transition-all duration-300 flex flex-col justify-between border-r border-white/10 bg-white/5 backdrop-blur-xl`}
      >

        {/* TOP */}
        <div>
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {!collapsed && <span className="font-semibold">📚 LMS</span>}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xl"
            >
              ☰
            </button>
          </div>

          {/* MENU */}
          <nav className="p-2 space-y-2">
            <NavLink to="/admin-dashboard" className={menuClass}>
              <span>📊</span>
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/admin-books" className={menuClass}>
              <span>📚</span>
              {!collapsed && <span>Books</span>}
            </NavLink>

            <NavLink to="/admin-users" className={menuClass}>
              <span>👤</span>
              {!collapsed && <span>Users</span>}
            </NavLink>

            <NavLink to="/admin-borrow" className={menuClass}>
              <span>🔄</span>
              {!collapsed && <span>Borrow</span>}
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/80 hover:bg-red-600 transition p-2 rounded-lg text-sm"
          >
            {collapsed ? "🚪" : "Logout"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-15 flex items-center justify-between px-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <h1 className="font-semibold">Admin Panel</h1>
          <div className="text-sm text-gray-300">
            Welcome, {username} 
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminLayout;