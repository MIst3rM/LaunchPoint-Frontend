import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { RepeatType } from '../../../types';

const variants = {
    initial: {
        opacity: 1,
        scale: 1.05
    },
    animate: {
        scale: [1.05, 1, 1.05],
        opacity: [1, 0.5, 1],
        transition: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: 'loop' as RepeatType,
        },
    }
};

const OnlineStatusIndicator = () => {

    return (
        <>
            <motion.div
                className={styles.statusIndicator}
                variants={variants}
                initial="initial"
                animate="animate"
            />
        </>
    );
};

export default OnlineStatusIndicator;