import { motion } from 'framer-motion'

import styles from './styles.module.css'

interface ButtonProps {
    text: string
    type: string
}

const Button = ({ text, type }: ButtonProps) => {

    const containerOffset = 100;
    const glowOffset = 0;

    const xAndY = `${containerOffset / 2 - glowOffset / 2}px`

    return (
        <motion.div
            className={`glowEffect ${styles.button} ${styles.glowEffect} ${type === 'login' ? styles.loginButton : styles.signupButton}`}
            whileHover={{ scale: 1.1 }}
        >
            {text}
            {type === 'login' &&
                <svg className={styles.glowContainer}>
                    <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowBlur}></rect>
                    <rect x={xAndY} y={xAndY} pathLength="100" strokeLinecap="round" className={styles.glowLine}></rect>
                </svg>
            }
        </motion.div>
    )
}

export default Button