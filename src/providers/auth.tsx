import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Client, Account, Models } from "appwrite";
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let client: Client;
let account: Account;

try {
    client = new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT);
    account = new Account(client);
} catch (error) {
    console.error('Something went wrong.', error);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLoggedInUser = useCallback(async () => {
        try {
            setLoading(true); // Set loading to true when starting to fetch
            const user = await account.get();
            setLoggedInUser(user);
        } catch (error) {
            console.error(error);
            setLoggedInUser(null);
        } finally {
            setLoading(false); // Set loading to false when done fetching
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            await account.createEmailSession(email, password);
            setLoggedInUser(await account.get());
        } catch (error) {
            console.error(error);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await account.deleteSession('current');
            setLoggedInUser(null);
        } catch (error) {
            console.error(error);
        }
    }, [])

    const authContextValue = useMemo(() => ({ loggedInUser, login, logout, fetchLoggedInUser, loading, client }), [loggedInUser, login, fetchLoggedInUser, loading, client]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
