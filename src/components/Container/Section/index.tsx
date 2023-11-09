import styles from "./styles.module.css";

import { ContainerProps } from "../../../types";

const Section = ({ children, customStyles }: ContainerProps) => {

    return (
        <div className={styles.section} style={customStyles}>
            {children}
        </div>
    );
};

export default Section;