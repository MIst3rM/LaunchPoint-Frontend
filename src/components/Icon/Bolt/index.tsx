import { motion } from "framer-motion";

const Bolt = ({ percentage }) => {

    const radius = 5;
    const circumference = 2 * Math.PI * radius;
    const percentageToShow = percentage ? percentage / 100 : 0;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - percentageToShow * circumference;

    return (
        <>
            <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M 12.625 9.65 c -0.05 -0.05 -0.1 -0.1 -0.175 -0.1 H 8.075 h -0.5 L 10.675 0.9 l 0.125 -0.35 c 0.025 -0.075 0.025 -0.15 -0.025 -0.2 l -0.025 -0.025 c -0.075 -0.1 -0.25 -0.125 -0.35 0 L 0.35 13.075 c -0.075 0.075 -0.05 0.175 -0.025 0.25 l 0 0 c 0.05 0.05 0.1 0.1 0.175 0.1 h 0.25 h 6.25 l -0.175 0.45 L 2.175 22.45 c -0.025 0.075 -0.025 0.15 0.025 0.2 c 0.075 0.1 0.25 0.15 0.375 0 l 0.075 -0.1 l 9.9 -12.55 l 0.075 -0.1 C 12.7 9.85 12.7 9.725 12.625 9.65 z" fill={"#000000"} style={{ transform: "scale(0.2) translate(43px,38px)" }} />
                <motion.circle
                    cx="10"
                    cy="10"
                    r="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                />
                {percentage &&
                    <motion.circle
                        cx="10"
                        cy="10"
                        r="5"
                        fill="none"
                        stroke="green"
                        strokeWidth="0.6"
                        strokeDasharray={strokeDasharray}
                        initial={{ strokeDashoffset: strokeDasharray }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        transform="rotate(-90 10 10)"
                    />
                }
            </motion.svg>

        </>
    );
};

export default Bolt;