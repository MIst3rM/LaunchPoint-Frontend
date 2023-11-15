import { useEffect, useRef, useState } from 'react';
import { useAnimate, useInView, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { TickerProps } from '../../types';

import styles from './styles.module.css';


const Ticker = ({
    children,
    duration = 10,
    onMouseEnter = () => { },
    onMouseLeave = () => { },
    isPlaying = true,
    direction = -1
}: TickerProps) => {
    const tickerRef = useRef<HTMLDivElement>(null);
    const [tickerUUID] = useState(uuidv4());
    const [tickerContentWidth, setTickerContentWidth] = useState(0);
    const [numDupes, setNumDupes] = useState(1);
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);
    const animationInstance = useRef<{ play: () => void; pause: () => void }>();

    useEffect(() => {
        let contentWidth = children.reduce((acc, _, index) => {
            const element = document.getElementById(`${tickerUUID}_${index}`)?.clientWidth || 0;
            return acc + element;
        }, 0);

        setTickerContentWidth(contentWidth);
    }, [children, tickerUUID]);

    useEffect(() => {
        if (tickerRef.current && tickerContentWidth) {
            const requiredDupes = Math.ceil((2 * tickerRef.current.clientWidth) / tickerContentWidth);
            setNumDupes(Math.max(requiredDupes, 1));
        }
    }, [tickerContentWidth]);

    // useEffect(() => {
    //     if (isInView && tickerRef.current && tickerContentWidth && !animationInstance.current) {
    //         animationInstance.current = animate(scope.current, { x: tickerContentWidth * direction }, { ease: 'linear', duration, repeat: Infinity });
    //     }
    // }, [isInView, tickerContentWidth, duration, direction, animate, scope]);

    useEffect(() => {
        if (isInView && tickerRef.current && tickerContentWidth) {
            // Calculate the total width of the duplicates
            const dupesTotalWidth = tickerContentWidth * numDupes;

            // The initial X position should offset by the width of the duplicates when direction is right
            // so that the original children appear first. If the direction is left, the initial X can be 0.
            const initialX = direction === 1 ? -dupesTotalWidth : 100;

            // The animation target X position should move the content to show all children and duplicates
            const animateToX = direction === 1 ? dupesTotalWidth : -dupesTotalWidth;

            console.log({ initialX, animateToX })

            animationInstance.current = animate(scope.current, { x: [initialX, animateToX] }, {
                ease: 'linear',
                duration,
                repeat: Infinity
            });

            //Pause immediately if not playing
            if (!isPlaying) {
                animationInstance.current.pause();
            }
        }
    }, [isInView, tickerContentWidth, duration, direction, animate, scope]);



    useEffect(() => {
        if (animationInstance.current) {
            if (isPlaying) {
                animationInstance.current.play();
            } else {
                animationInstance.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <motion.div
            className={styles.tickerContainer}
            ref={tickerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <motion.div
                ref={scope}
                className={styles.tickerContainerContents}
            >

                {
                    direction === 1 &&
                    [...Array(numDupes)].map((_, i) =>
                        children.map((item, index) => (
                            <div key={`left-dup-${i}_${index}`}>{item}</div>
                        ))
                    )
                }

                {children.map((item, index) => (
                    <div key={`original-${index}`} id={`${tickerUUID}_${index}`}>
                        {item}
                    </div>
                ))}

                {
                    direction === -1 &&
                    [...Array(numDupes)].map((_, i) =>
                        children.map((item, index) => (
                            <div key={`right-dup-${i}_${index}`}>{item}</div>
                        ))
                    )
                }
            </motion.div>
        </motion.div>
    );
};

export default Ticker;
