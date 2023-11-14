import { useEffect, useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "../../../helpers/use-dimensions";
import MenuToggle from "./Toggle";

import styles from "./styles.module.css";

const variants = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 20,
            restDelta: 2
        }
    }),
    closed: {
        clipPath: "circle(30px at calc(100% - 40px) 40px)",
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
};

const Sidebar = ({ openSidebar }) => {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const dimensions = useDimensions(containerRef);

    useEffect(() => {
        openSidebar(isOpen);
    }, [isOpen]);

    return (
        <motion.nav
            className={styles.sidebar}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={dimensions?.height}
            ref={containerRef}
        >
            <motion.div className={styles.background} variants={variants} />
            <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    );
}

export default Sidebar;