import { Outlet, Navigate } from "react-router-dom";

export const AdminLayout = () => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="app_admin_wrapper">
      <div className="app_admin_cover_wrapper">
        <Outlet />
      </div>
    </div>
  );
};
