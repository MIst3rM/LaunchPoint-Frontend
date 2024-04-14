import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import { TickerCardProps } from '../../../types';
import OnlineStatusIndicator from '../../Status/OnlineStatusIndicator';

const TickerCard = forwardRef<HTMLDivElement, TickerCardProps>(({ style, data }, ref) => {
    console.log(data);
    return (
        <motion.div
            className={styles.tickerCardContainer}
            style={{ ...style }}
            ref={ref}
        >
            <div className={styles.header}>
                <span className={styles.name}>
                    {`${data.name}`}
                </span>
                <OnlineStatusIndicator status={data.status} />
            </div>
            <div className={styles.body}>
                <div className={styles.row}>
                    <span className={styles.label}>Location </span>
                    <span className={styles.value}>{data.location}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Batteries </span>
                    <span className={styles.value}>{data.batteries.length}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Available slots </span>
                    <span className={styles.value}>{data.slots.filter(slot => !slot.battery).length}</span>
                </div>
            </div>
        </motion.div>
    );
});

export default TickerCard;