import { motion } from "framer-motion";

import styles from "./styles.module.css";

const Path = props => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="rgb(162	171	180)"
        strokeLinecap="round"
        {...props}
    />
);

const MenuToggle = ({ toggle }) => (
    <button className={styles.sidebarButton} onClick={toggle}>
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path
                variants={{
                    closed: { d: "M 2 21 L 21 2", rotate: 45 },
                    open: { d: "M 2 2 L 21 21", rotate: 0 }
                }}
                transition={{ duration: 0.5 }}
            />
            <Path
                variants={{
                    closed: { d: "M 2 2 L 21 21", rotate: 45 },
                    open: { d: "M 2 21 L 21 2", rotate: 0 }
                }}
                transition={{ duration: 0.5 }}
            />
        </svg>
    </button>
);

export default MenuToggle;
