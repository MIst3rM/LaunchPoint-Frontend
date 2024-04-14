import createGlobe from "cobe";
import { useSpring } from '@react-spring/web'
import { useEffect, useRef, FunctionComponent } from "react";
import styles from "./styles.module.css";

type GlobeInstance = {
    destroy: () => void;
    toggle(shouldRender: boolean): void;
};

let globe: GlobeInstance;

const Globe: FunctionComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const focusRef = useRef([0, 0])
    const currentTheta = useRef(0.3);
    const currentScale = useRef(1);
    const rotate = useRef<boolean>(true);

    const locationToAngles = (lat: number, long: number) => {
        return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
    };

    const [thetaProps, setTheta] = useSpring(() => ({
        theta: 0.3,
        config: { mass: 3, tension: 120, friction: 40, precision: 0.001 },
    }));

    const [scaleProps, setScale] = useSpring(() => ({
        scale: 1,
        config: { mass: 3, tension: 120, friction: 40, precision: 0.001 },
    }));

    const handleClick = (lat: number, long: number) => {
        focusRef.current = locationToAngles(lat, long);
        rotate.current = false;
        setScale({ scale: 2.0, from: { scale: currentScale.current } });

        setTimeout(() => {
            rotate.current = true;
            setTheta({ theta: 0.3, from: { theta: currentTheta.current } });
            setScale({ scale: 1, from: { scale: currentScale.current } });
        }, 5000);
    }

    useEffect(() => {
        let width = 0;
        let currentPhi = 0;
        const doublePi = Math.PI * 2;
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };

        window.addEventListener('resize', onResize)
        onResize()

        if (canvasRef.current) {
            globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: width * 2,
                height: width * 2,
                phi: 0,
                theta: 0.3,
                dark: 1,
                diffuse: 3,
                mapSamples: 60000,
                mapBrightness: 1.2,
                baseColor: [1, 1, 1],
                markerColor: [251 / 255, 100 / 255, 21 / 255],
                glowColor: [1.2, 1.2, 1.2],
                scale: 1,
                markers: [
                    { location: [45.495840, -73.578940], size: 0.1 },
                    { location: [42.377419, -71.122452], size: 0.1 },
                    { location: [51.757881, -1.262100], size: 0.1 },
                    { location: [1.344460, 103.680779], size: 0.1 },
                ],
                onRender: (state) => {
                    if (rotate.current) {
                        state.theta = thetaProps.theta.get();
                        currentPhi += 0.002
                        currentScale.current = 1
                    } else {
                        state.theta = currentTheta.current;
                        const [focusPhi, focusTheta] = focusRef.current
                        const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
                        const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
                        // Control the speed
                        if (distPositive < distNegative) {
                            currentPhi += distPositive * 0.04
                        } else {
                            currentPhi -= distNegative * 0.04
                        }
                        currentTheta.current = currentTheta.current * 0.96 + focusTheta * 0.04
                        currentScale.current = 2.0
                    }
                    state.phi = currentPhi
                    state.scale = scaleProps.scale.get();
                    state.width = width * 2
                    state.height = width * 2
                }

            }) as GlobeInstance;

            setTimeout(() => {
                if (canvasRef.current) {
                    canvasRef.current.style.opacity = '1';
                }
            });

            return () => {
                globe.destroy();
                window.removeEventListener('resize', onResize);
            }
        }
    }, [])


    return <div className={styles.canvasContainer}>
        <canvas
            ref={canvasRef}
            className={styles.canvas}
        />
        {/* Examples of locations */}
        {/* TODO: Fetch stations from database and display them here */}
        <div className={styles.stationLocButtonContainer}>
            <button onClick={() => {
                handleClick(45.495840, -73.578940)
            }}>📍 Concordia University</button>
            <button onClick={() => {
                handleClick(42.377419, -71.122452)
            }}>📍 Harvard University</button>
            <button onClick={() => {
                handleClick(51.757881, -1.262100)
            }}>📍 Oxford University</button>
            <button onClick={() => {
                handleClick(1.344460, 103.680779)
            }}>📍 Nanyang Technological University</button>
        </div>
    </div>
}

export default Globe;