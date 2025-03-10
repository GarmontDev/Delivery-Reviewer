import { createBrowserRouter } from "react-router-dom";
import LayoutRoot from "../layout/LayoutRoot.jsx";
import LayoutPrivate from "../layout/LayoutPrivate.jsx";
import Login from "../pages/Login.jsx";
import Home from "../Home.jsx";
import DeliveryNote from "../components/DeliveryNote/DeliveryNote.jsx";
import CreateFile from "../components/CreateFile/CreateFile.jsx";
import UserSelection from "../components/EmployeeSelection/EmployeeSelection.jsx";
import Page404 from "../pages/Page404.jsx";
import CreateTemporaryFile from "../components/CreateFile/CreateTemporaryFile.jsx";
import DemoPage from "../pages/Demo/DemoPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutRoot />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/demo",
        element: <LayoutRoot />,
        children: [
          {
            index: true,
            element: <DemoPage />,
          },
        ],
      },
      {
        path: "/home",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
      {
        path: "/notes",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <DeliveryNote />,
          },
        ],
      },
      {
        path: "/create",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <CreateFile />,
          },
        ],
      },
      {
        path: "/userselection",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <UserSelection />,
          },
        ],
      },
      {
        path: "/createfile",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <CreateFile />,
          },
        ],
      },
      {
        path: "/createtemporaryfile",
        element: <LayoutPrivate />,
        children: [
          {
            index: true,
            element: <CreateTemporaryFile />,
          },
        ],
      },
    ],
  },
]);
