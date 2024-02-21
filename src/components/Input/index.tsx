import textConstants from '../../textConstants'
import styles from './styles.module.css'

const Input = (props) => {
    return (
        <>
            {
                props.type === 'password' &&
                <div className={styles.linkContainer}>
                    <a href="#" className={styles.forgotPassword}>{textConstants.loginForm.forgotPassword}</a>
                </div>
            }
            < div className={styles.inputContainer} >
                <input {...props} className={styles.input} style={{ border: props.border }} />
                <label className={styles.label}>{props.name}</label>
            </div >
        </>
    )
}

export default Input