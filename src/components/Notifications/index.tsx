import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './styles.module.css';
import CloseButton from '../Button/Close';

interface NotificationProps {
    notifications: any[],
    updateNotifications?: (id: string) => void
}

const Notification = ({ notifications, updateNotifications }: NotificationProps) => {
    const [expanded, setExpanded] = useState(false);

    // Only take the latest 5 notifications
    const latestNotifications = notifications.slice(-5);

    return (
        <motion.ul
            className={styles.notificationContainer}
            animate={{
                opacity: 1,
                transition: {
                    staggerChildren: 0.5
                }
            }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {latestNotifications.map((notification, index) => (
                    <motion.li
                        layout
                        key={notification.$id || index}
                        className={styles.notification}
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: index * 0.5 } }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            top: expanded ? 0 : index * 100,
                            zIndex: 100 - (notifications.length - index),
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <CloseButton close={(e) => {
                            e.stopPropagation();
                            if (updateNotifications) updateNotifications(notification.$id);
                        }} />
                        <div className={styles.notificationContent}>
                            <span className={styles.notificationTitle}>{`${notification.drone}`}</span>
                            {/* Display each summary message on its own row */}
                            {notification.summary.split('.').filter(message => message.trim()).map((message, messageIndex) => (
                                <div key={messageIndex} className={styles.notificationMessage}>
                                    {`⚠️ ${message.trim()}.`}
                                </div>
                            ))}

                        </div>
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
    );
};

export default Notification;
