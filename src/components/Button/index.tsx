import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { ButtonProps, ButtonType } from '../../types';
import { Link } from 'react-router-dom';

const buttonStyles: { [key in ButtonType]: string } = {
    login: styles.loginButton,
    logout: styles.logoutButton,
    signup: styles.signupButton,
    edit: styles.editButton,
    delete: styles.deleteButton,
    continue: styles.continueButton,
    seemore: styles.seeMoreButton,
};

const Button = ({ text, type, layoutId, onClick, disabled }: ButtonProps) => {

    const containerOffset = 100;
    const glowOffset = 0;
    const xAndY = `${containerOffset / 2 - glowOffset / 2}px`

    const buttonStyle = buttonStyles[type]

    const handleClick = () => {
        if (disabled) {
            return;
        }
        if (onClick) {
            onClick();
        }
    }

    return (
        <motion.div
            layoutId={layoutId}
            className={`glowEffect ${styles.button} ${styles.glowEffect} ${buttonStyle}`}
            whileHover={{ scale: 1.1 }}
            onClick={handleClick}
        >
            {type === 'login' || type === 'signup' ? (
                <>
                    <svg className={styles.glowContainer}>
                        <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowBlur}></rect>
                        <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowLine}></rect>
                    </svg>
                    <Link to={`/${type}`} className={styles.buttonLink}>
                        <motion.span layout='position' layoutId={`${text}-button-title`}>{text}</motion.span>
                    </Link>
                </>
            ) : (
                <motion.span layout='position' layoutId={`${text}-button-title`}>{text}</motion.span>
            )}
        </motion.div>
    )
}

export default Button