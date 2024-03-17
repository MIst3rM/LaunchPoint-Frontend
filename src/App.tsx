import * as React from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Root from "./routes/Root";
import { AuthDialog } from "./components";
import { useAuth } from "./providers/auth";
import Deployments from "./routes/Deployments";
import { ImageData } from "./types";

const pexel = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images: ImageData[] = [
    // Front
    { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(2889701), title: "Montreal" },
    // Back
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(2265845), title: "Paris" },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(5771259), title: "Milan" },
    // Left
    { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(4390589), title: "San Francisco" },
    { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(1878293), title: "Sydney" },
    { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(9245761), title: "Miami" },
    // Right
    { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(6136571), title: "Los Angeles" },
    { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(2404843), title: "New York" },
    { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(2834219), title: "London" }
]

const App = () => {

    const { loggedInUser, fetchLoggedInUser, client } = useAuth();

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
        },
        {
            path: "/deployments",
            element: <Deployments images={images} />,
            children: [
                {
                    path: "item/:id",
                    // element: <Deployments images={images} />,
                    children: [
                        {
                            path: "stations",
                            // element: <Deployments images={images} />,
                        }
                    ]
                }
            ]
        }
    ]);

    const location = useLocation();

    if (!element) return null;

    return (
        <AnimatePresence mode="wait" initial={false}>
            {element}
        </AnimatePresence>
    );
}

export default App;