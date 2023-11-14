import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { AuthDialogProps } from '../../../types'
import Overlay from '../../Container/Overlay'
import { Client, Account, ID } from "appwrite";

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

const AuthDialog = ({ type, layoutId, isOpen, showDialog }: AuthDialogProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async () => {

    }

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const promise = account.create(ID.unique(), 'misterm@test.com', 'misterm12345');
        promise.then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
    }

    return (
        <>
            <Overlay isOpen={isOpen} />
            <motion.div
                className={styles.authDialogContainer}
                onClick={() => showDialog ? showDialog(false) : null}
            >
                <motion.div
                    layoutId={layoutId}
                    className={styles.authDialog}
                    onClick={(e) => e.stopPropagation()}
                >

                    {type === 'login' &&
                        <h1>Login</h1>
                    }
                    {type === 'signup' &&
                        <>
                            <h1>Sign Up</h1>
                            <button
                                onClick={() => handleSignup()}
                            >
                                sign up
                            </button>
                        </>
                    }
                </motion.div>
            </motion.div>
        </>
    )
}

export default AuthDialog;