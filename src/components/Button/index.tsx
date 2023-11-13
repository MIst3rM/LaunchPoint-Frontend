import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { ButtonProps, ButtonType } from '../../types';

const buttonStyles: { [key in ButtonType]: string } = {
    login: styles.loginButton,
    signup: styles.signupButton,
    edit: styles.editButton,
    delete: styles.deleteButton,
};

const Button = ({ text, type, layoutId, showDialog }: ButtonProps) => {

    const containerOffset = 100;
    const glowOffset = 0;
    const xAndY = `${containerOffset / 2 - glowOffset / 2}px`

    const buttonStyle = buttonStyles[type]

    const isLoginButton = type === 'login';

    return (
        <motion.div
            layoutId={layoutId}
            className={`glowEffect ${styles.button} ${styles.glowEffect} ${buttonStyle}`}
            whileHover={{ scale: 1.1 }}
            onClick={() => showDialog ? showDialog(true): null}
        >
            {text}
            {isLoginButton &&
                <svg className={styles.glowContainer}>
                    <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowBlur}></rect>
                    <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowLine}></rect>
                </svg>
            }
        </motion.div>
    )
}

export default Button