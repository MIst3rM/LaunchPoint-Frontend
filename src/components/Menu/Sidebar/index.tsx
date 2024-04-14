import { useEffect, useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "../../../helpers/use-dimensions";
import MenuToggle from "./Toggle";

import styles from "./styles.module.css";
import { SidebarProps } from "../../../types";

const Sidebar = ({ navClasses, backgroundClasses, openSidebar }: SidebarProps) => {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const dimensions = useDimensions(containerRef);

    const navClassName = [
        styles.sidebar,
        ...(Array.isArray(navClasses) ? navClasses : [navClasses || ''])
    ].join(' ').trim();

    const backgroundClassName = [
        styles.background,
        ...(Array.isArray(backgroundClasses) ? backgroundClasses : [backgroundClasses || ''])
    ].join(' ').trim();

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

    useEffect(() => {
        openSidebar(isOpen);
    }, [isOpen]);

    return (
        <motion.nav
            className={navClassName}
            variants={variants}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={dimensions?.height}
            ref={containerRef}
        >
            <motion.div className={backgroundClassName}>

            </motion.div>
            <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    );
}

export default Sidebar;