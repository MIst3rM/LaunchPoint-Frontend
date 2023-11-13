import { motion } from "framer-motion";

import styles from "./styles.module.css";

import { ContainerProps } from "../../../types";

const Section = ({ children, customProps = {} }: ContainerProps) => {

    const className = [
        styles.section,
        ...(Array.isArray(customProps?.classes) ? customProps.classes : [customProps?.classes || ''])
    ].join(' ').trim();

    return (
        <motion.div
            className={className}
            {...customProps?.effects}
        >
            {children}
        </motion.div>
    );
};

export default Section;