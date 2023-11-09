import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { AuthDialogProps } from '../../../types'
import Overlay from '../../Container/Overlay'

const AuthDialog = ({ type, layoudId, isOpen, showDialog }: AuthDialogProps) => {
    return (
        <>
            <Overlay isOpen={isOpen} />
            <motion.div
                className={styles.authDialogContainer}
                onClick={() => showDialog ? showDialog(false) : null}
            >
                <motion.div
                    layoutId={layoudId}
                    className={styles.authDialog}
                >
                    <h1>Login</h1>
                </motion.div>
            </motion.div>
        </>
    )
}

export default AuthDialog;