import { useEffect, useRef, useState } from 'react';
import { useAnimate, useInView } from 'framer-motion';
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

    useEffect(() => {
        if (isInView && tickerRef.current && tickerContentWidth && !animationInstance.current) {
            animationInstance.current = animate(scope.current, { x: tickerContentWidth * direction }, { ease: 'linear', duration, repeat: Infinity });
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
        <div
            className={styles.tickerContainer}
            ref={tickerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                ref={scope}
                className={styles.tickerContainerContents}
            >
                {children.map((item, index) => (
                    <div key={`${tickerUUID}_${index}`} id={`${tickerUUID}_${index}`}>
                        {item}
                    </div>
                ))}
                {[...Array(numDupes)].map((_, i) =>
                    children.map((item, index) => <div key={`${i}_${index}`}>{item}</div>)
                )}
            </div>
        </div>
    );
};

export default Ticker;
