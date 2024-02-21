import * as React from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Root from "./routes/Root";
import { AuthDialog } from "./components";
import { useAuth } from "./providers/auth";

const App = () => {

    const { loggedInUser, fetchLoggedInUser } = useAuth();

    React.useEffect(() => {
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
        }
    ]);

    const location = useLocation();

    if (!element) return null;

    return (
        <AnimatePresence mode="wait" initial={false}>
            {React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
    );
}

export default App;