import { HeroProps } from "../../types";
import styles from "./styles.module.css";

const Hero = ({ title, subtitle, children }: HeroProps) => {
    return (
        <div className={styles.hero}>
            <div className={styles.title}>
                <h1>{title}</h1>
            </div>
            <div className={styles.subtitle}>
                <h3>{subtitle}</h3>
            </div>
            {children}
        </div>
    )
}

export default Hero;