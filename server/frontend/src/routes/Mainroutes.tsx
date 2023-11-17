import { NotFoundPage } from "../components/NotFoundPage";
import { HomePage } from "../components/HomePage";
import { ChatPage } from "../components/ChatPage";
import { Navigate } from "react-router-dom";
import { LayOut } from "../components/LayOut";
import { getCurrentUser } from "../services/auth.service";
import { AdminPage } from "../components/AdminPage";
import LoginPage from "../components/LoginPage";

const notFound = {
  path: "/*",
  element: <NotFoundPage />,
};

const Mainroutes = () => {
  const currentUser = getCurrentUser();

  return [
    {
      path: "/",
      element: <LayOut />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/admin",
          element: currentUser ? <AdminPage /> : <Navigate to="/login" />,
        },
        {
          path: "/user",
          element: <ChatPage />,
        },
        {
          path: "/login",
          element: currentUser ? <Navigate to='/admin' /> : <LoginPage />,
        },
      ],
    },
    notFound,
  ];
};

export default Mainroutes;
