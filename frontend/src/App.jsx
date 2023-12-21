import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
//import SignupFormModal from "./components/SignupFormModal/SignupFormModal";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import SpotList from "./components/Spots/SpotList";
import SpotDetailsPage from "./components/Spots/SpotDetails";
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <SpotList/>,
      },
      {
        path:`/spots/:spotId`,
        element:<SpotDetailsPage/>
      }

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
