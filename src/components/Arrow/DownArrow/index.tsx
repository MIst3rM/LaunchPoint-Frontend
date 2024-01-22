import { motion } from 'framer-motion';

import styles from './styles.module.css';
import { DownArrowProps } from '../../../types';

const DownArrow = ({ handleClick, isExpanded }: DownArrowProps) => {
    return (
        <>
            <motion.div
                className={styles.arrow}
                onClick={handleClick}
                animate={{
                    translateY: isExpanded ? '-50%' : '0%',
                    y: isExpanded ? [0, -10, 0] : [0, 10, 0],
                    scaleY: isExpanded ? -1 : 1,
                }}
                transition={{
                    y: {
                        duration: 2.0,
                        ease: "easeInOut",
                        repeat: Infinity,
                    },
                    rotate: {
                        duration: 0.8,
                        ease: "easeInOut"
                    }
                }}
                style={{
                    transformOrigin: 'bottom'
                }}
            >
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <line x1="50" y1="80" x2="30" y2="60" stroke="white" strokeWidth="2" />
                    <line x1="50" y1="80" x2="70" y2="60" stroke="white" strokeWidth="2" />
                </svg>
            </motion.div>
        </>
    )
}

export default DownArrow;