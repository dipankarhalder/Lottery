import { Outlet, Navigate } from "react-router-dom";

export const AuthLayout = () => {
  const isAuthenticated = localStorage.getItem("token");
  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return (
    <div className="app_auth_wrapper">
      <div className="app_auth_wrapper_sidebar">
        <Outlet />
      </div>
    </div>
  );
};
