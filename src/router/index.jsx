import { createBrowserRouter } from "react-router-dom";
import LayoutRoot from "../layout/LayoutRoot.jsx";
import LayoutPrivate from "../layout/LayoutPrivate.jsx";
import Login from "../pages/Login.jsx";
import Home from "../Home.jsx"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutRoot/>,
        children:   [
            {
                index: true,
                element: <Login/>
            },
            {
                path: '/home',
                element: <LayoutPrivate/>,
                children: [
                    {
                        index: true,
                        element: <Home/>
                    }
                ]
            }
        ]
    }
])