import { motion } from "framer-motion";
import styles from "./styles.module.css";
import { OverlayProps } from "../../../types";

const Overlay = ({ isOpen }: OverlayProps) => {

    return (
        <motion.div
            className={styles.overlay}
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
        </motion.div>
    )
};

export default Overlay;