import { motion, AnimatePresence } from 'framer-motion';

import styles from './styles.module.css';

const Accordion = ({ i, expanded, setExpanded, brief, full }) => {
    const isOpen = i === expanded;

    return (
        <>
            <motion.div
                initial={false}
                animate={{
                    backgroundColor: isOpen ? "white" : "gray",
                }}
                onClick={() => setExpanded(isOpen ? false : i)}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "2rem 4rem",
                    cursor: "pointer",
                }}
            >
                {brief}
            </motion.div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        // Add animations for the accordion content
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{
                            backgroundColor: "white",
                            padding: "0 2rem",
                        }}
                    >
                        {full}
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
};

export default Accordion;