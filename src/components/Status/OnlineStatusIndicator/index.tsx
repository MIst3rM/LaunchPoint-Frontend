import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { RepeatType, status } from '../../../types';

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

interface OnlineStatusIndicatorProps {
    status?: status;
    position?: 'flex-start' | 'center' | 'flex-end';
}

const OnlineStatusIndicator = ({ status, position }: OnlineStatusIndicatorProps) => {

    console.log(status);
    const statusClass = () => {
        switch (status) {
            case 'AVAILABLE':
                return styles.green;
            case 'UNAVAILABLE':
                return styles.red;
            case 'MAINTENANCE_NEEDED':
                return styles.yellow;
            case 'IN_USE':
                return styles.yellow;
            default:
                return styles.green;
        }
    }

    return (
        <>
            <motion.div
                className={styles.statusIndicator + ' ' + statusClass()}
                style={{ alignSelf: position }}
                variants={variants}
                initial="initial"
                animate="animate"
            />
        </>
    );
};

export default OnlineStatusIndicator;