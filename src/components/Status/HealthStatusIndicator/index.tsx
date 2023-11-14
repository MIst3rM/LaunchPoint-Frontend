import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HealthStatusIndicatorProps } from '../../../types';

import styles from './styles.module.css';
import gauge from '../../../assets/gauge.webp';

const lowA = 0;
const highA = 100;

const lowB = 48;
const highB = -227;

const sidebarVariants = {
    open: {
        x: -250,
        transition: {
            duration: 0.5,
            ease: 'easeInOut'
        }
    },
    closed: {
        x: 0,
        transition: {
            delay: 0.5,
            duration: 0.5,
            ease: 'easeInOut'
        }
    }
}

const HealthStatusIndicator = ({ healthPercentage, isSidebarOpen }: HealthStatusIndicatorProps) => {
    const [angle, setAngle] = useState(-90);

    useEffect(() => {
        const value = Math.max(lowA, Math.min(healthPercentage, highA));

        setAngle(lowB + ((highB - lowB) * (value - lowA)) / (highA - lowA));
    }, [healthPercentage]);

    return (
        <motion.div
            className={styles.gaugeContainer}
            variants={sidebarVariants}
            initial={false}
            animate={isSidebarOpen ? 'open' : 'closed'}
        >
            <div className={styles.gaugeCircle} />
            <div className={styles.gaugeBackgroundImageWrapper}>
                <img
                    src={gauge}
                    alt=""
                    className={styles.gaugeBackgroundImage}
                    sizes="173px"
                    loading="lazy"
                />
            </div>
            <div className={styles.cube}>
                <div className={styles.ellipse} />
                <motion.div
                    className={styles.ticker}
                    initial={{ rotate: -90 }} // Start position for the ticker
                    animate={{ rotate: angle }} // End position for the ticker
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    style={{
                        transformOrigin: 'bottom center', // Or '100% 100%' if the ticker's bottom is at its right end
                    }}
                />
                <div className={styles.tickerDot} />
            </div>
        </motion.div>
    );
};

export default HealthStatusIndicator;
