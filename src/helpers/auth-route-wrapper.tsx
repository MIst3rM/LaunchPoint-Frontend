import { Navigate } from 'react-router-dom';

export const AuthenticatedRouteWrapper = ({ children, loggedInUser }) => {
    return loggedInUser ? children : <Navigate to="/login" replace />;
};
