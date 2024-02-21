import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Client, Account, Models } from "appwrite";

interface AuthContextType {
    loggedInUser: Models.User<Models.Preferences> | null;
    login: (email: string, password: string) => Promise<void>;
}

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

    const login = useCallback(async (email: string, password: string) => {
        try {
            await account.createEmailSession(email, password);
            setLoggedInUser(await account.get());
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ loggedInUser, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
