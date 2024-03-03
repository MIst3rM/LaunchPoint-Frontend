import {useEffect, cloneElement} from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Root from "./routes/Root";
import { AuthDialog } from "./components";
import { useAuth } from "./providers/auth";
import Livemap from "./routes/Livemap";

const App = () => {

    const { loggedInUser, fetchLoggedInUser } = useAuth();

    useEffect(() => {
        if(loggedInUser)
            fetchLoggedInUser();
    }, [fetchLoggedInUser]);

    const element = useRoutes([
        {
            path: "/",
            element: <Root loggedInUser={loggedInUser} />,
        },
        {
            path: "/login",
            element: <AuthDialog type='login' layoutId='loginLayout' />
        },
        {
            path: "/signup",
            element: <AuthDialog type='signup' layoutId='signupLayout' />
        },
        {
            path: "/livemap",
            element: <Livemap />
        }
    ]);

    const location = useLocation();

    if (!element) return null;

    return (
        <AnimatePresence mode="wait" initial={false}>
            {cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
    );
}

export default App;