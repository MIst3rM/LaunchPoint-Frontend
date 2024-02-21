import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

const Overlay = () => {

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: "auto" }}
        >
            <Link to="/" />
        </motion.div>
    )
};

export default Overlay;