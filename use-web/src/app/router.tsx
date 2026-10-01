import { createBrowserRouter, Navigate } from "react-router-dom";
import { CreateUserPage } from "../features/users/pages/CreateUserPage";
import { EditUserPage } from "../features/users/pages/EditUserPage";
import { UserDetailsPage } from "../features/users/pages/UserDetailsPage";
import { UsersPage } from "../features/users/pages/UsersPage";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/users" replace /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/users/new", element: <CreateUserPage /> },
      { path: "/users/:id", element: <UserDetailsPage /> },
      { path: "/users/:id/edit", element: <EditUserPage /> },
      { path: "*", element: <Navigate to="/users" replace /> },
    ],
  },
]);
