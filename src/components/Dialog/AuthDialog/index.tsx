import { motion } from 'framer-motion'
import styles from './styles.module.css'
import { AuthDialogProps, LoginFormValues } from '../../../types'
import Overlay from '../../Container/Overlay'
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { Button, Input } from '../../';
import textConstants from '../../../textConstants';
import * as Yup from 'yup';
import { useAuth } from '../../../providers/auth'

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required')
});

const AuthDialog = ({ type, layoutId }: AuthDialogProps) => {
    const { login } = useAuth();

    return (
        <>
            <Overlay />
            <div
                className={styles.authDialogContainer}
            >
                <motion.div
                    layoutId={layoutId}
                    className={styles.authDialog}
                    onClick={(e) => e.stopPropagation()}
                >

                    {type === 'login' &&
                        <>
                            <div className={styles.loginForm}>
                                <div className={styles.titleContainer}>
                                    <motion.span
                                        layout='position'
                                        layoutId={`Login-button-title`}
                                        style={{
                                            fontSize: '25px',
                                            fontWeight: 600,
                                        }}
                                    >{textConstants.loginForm.title}
                                    </motion.span>
                                </div>
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: '',
                                        rememberMe: false,
                                    }}
                                    validationSchema={LoginSchema}
                                    onSubmit={(
                                        values: LoginFormValues,
                                        { setSubmitting }: FormikHelpers<LoginFormValues>
                                    ) => {
                                        login(values.email, values.password);
                                        setSubmitting(false);
                                    }}
                                >
                                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched, isSubmitting }) => {
                                        return (
                                            <Form className={styles.form}>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    placeholder=""
                                                    type="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                    border={touched.email && errors.email ? "1px solid red" : null}
                                                    as={Input}
                                                />
                                                <Field
                                                    id="password"
                                                    name="password"
                                                    placeholder=""
                                                    type="password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    border={touched.password && errors.password ? "1px solid red" : null}
                                                    as={Input}
                                                />
                                                <div className={styles.inputContainer}>
                                                    <label>
                                                        <Field className={styles.rememberMe} id="rememberMe" name="rememberMe" type="checkbox" />
                                                        {textConstants.loginForm.rememberMe}
                                                    </label>
                                                </div>
                                                <Button text='Continue' type='continue' onClick={handleSubmit} disabled={isSubmitting} />
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </>
                    }
                    {type === 'signup' &&
                        <>
                            <h1>Sign Up</h1>
                        </>
                    }
                </motion.div>
            </div>
        </>
    )
}

export default AuthDialog;