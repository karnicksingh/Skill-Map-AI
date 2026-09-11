import {createBrowserRouter} from "react-router";
import {login as Login} from "./features/auth/pages/login.jsx";
import {register as Register} from "./features/auth/pages/register.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])