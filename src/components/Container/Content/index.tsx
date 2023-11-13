import { motion } from "framer-motion";
import styles from "./styles.module.css";

import { ContainerProps } from "../../../types";

const Content = ({ children }: ContainerProps) => {

    const variants = {
        hidden: {
            y: 40,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.5,
                type: "spring",
                stiffness: 50,
                damping: 15,
                mass: 1,
            }
        },
    }

    return (
        <motion.div
            className={styles.content}
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );

}

export default Content;