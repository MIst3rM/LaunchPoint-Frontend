import { motion } from "framer-motion";
import styles from "./styles.module.css";

const Path = props => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        {...props}
    />
);

const CloseButton = ({ close }) => (
    <button
        onClick={close} className={styles.button + " " + styles.close}>
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path d="M 3 16.5 L 17 2.5" />
            <Path d="M 3 2.5 L 17 16.346" />
        </svg>
    </button>
);

export default CloseButton;