import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthLayout } from "./layouts/AuthLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { SigninPage } from "./pages/SigninPage";
import { DashboardPage } from "./pages/DashboardPage";

/** routes path */
const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <SigninPage /> }],
  },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
]);

export const App = () => {
  return <RouterProvider router={routes} />;
};
