import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './styles.module.css';
import { CounterProps } from '../../types';

const Counter = ({ targetDigits }: CounterProps) => {
    const [digits, setDigits] = useState([0, 0, 0]); // [hundreds, tens, ones]
    const [isRunning, setIsRunning] = useState(true);

    // Animation variants for the sliding effect
    const variants = {
        enter: { y: 30, opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: -30, opacity: 0 },
    };

    let cycleDuration = 2000 / ((Math.max(...targetDigits) + 1) * 10);
    const slowCycleDuration = 500;

    useEffect(() => {
        // Start or restart the animation whenever the target changes
        setIsRunning(true);
        setDigits((prevDigits) => {
            // Only reset digits if the target is greater than the current
            const currentNumber = parseInt(prevDigits.join(''), 10);
            const targetNumber = parseInt(targetDigits.join(''), 10);
            return targetNumber > currentNumber ? prevDigits : targetDigits.map(() => 0);
        });
    }, [targetDigits]);

    useEffect(() => {
        if (!isRunning) return;

        // Convert the digits array to a single number for comparison
        const currentNumber = parseInt(digits.join(''), 10);
        const targetNumber = parseInt(targetDigits.join(''), 10);
        const distanceToTarget = targetNumber - currentNumber;

        // Stop the animation if we've reached the target number
        if (currentNumber >= targetNumber) {
            setIsRunning(false);
            return;
        }

        // Calculate the speed factor based on the distance to the target
        // Start slowing down only when 10 or fewer numbers away from the target
        const slowDownThreshold = 10;
        const isCloseToTarget = distanceToTarget <= slowDownThreshold;
        const speedFactor = isCloseToTarget ? distanceToTarget / slowDownThreshold : 1;

        // Adjust the cycle duration based on the speed factor
        cycleDuration = isCloseToTarget
            ? cycleDuration + (slowCycleDuration - cycleDuration) * (1 - speedFactor)
            : cycleDuration;

        const timer = setTimeout(() => {
            setDigits(([hundreds, tens, ones]) => {
                let nextOnes = ones === 9 ? 0 : ones + 1;
                let nextTens = ones === 9 ? (tens === 9 ? 0 : tens + 1) : tens;
                let nextHundreds = ones === 9 && tens === 9 ? (hundreds === 9 ? 0 : hundreds + 1) : hundreds;

                return [nextHundreds, nextTens, nextOnes];
            });
        }, cycleDuration);

        return () => clearTimeout(timer);
    }, [digits, targetDigits, isRunning]);

    return (
        <div className={styles.digitsContainer}>
            {digits.map((digit, index) => (
                <div className={styles.digitContainer} key={index}>
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={digit}
                            className={styles.digit}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                y: { duration: cycleDuration / 1000, ease: 'linear' },
                                opacity: { duration: cycleDuration / 2000, ease: 'linear' }
                            }}
                        >
                            {digit}
                        </motion.div>
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default Counter;