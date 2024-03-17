import styles from './styles.module.css';

const Grid = ({ children }) => {
    return (
        <div className={styles.grid}>
            {children}
        </div>
    )
}

export default Grid;