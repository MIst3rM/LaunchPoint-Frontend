import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { TickerCardProps } from '../../../types';

const TickerCard = forwardRef<HTMLDivElement, TickerCardProps>(({ id, style, data }, ref) => {
    return (
        <motion.div
            className={styles.tickerCardContainer}
            style={{ ...style }}
            ref={ref}
        >
            <div className={styles.header}>
                <span className={styles.id}>
                    {`Station #${id}`}
                </span>
            </div>

        </motion.div>
    );
});

export default TickerCard;