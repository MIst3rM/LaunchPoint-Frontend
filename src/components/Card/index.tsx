import { useEffect, useState } from 'react';
import { motion, AnimatePresence, } from 'framer-motion';
import Grid from '../Grid';
import OnlineStatusIndicator from '../Status/OnlineStatusIndicator';
import styles from './styles.module.css';
import Bolt from '../Icon/Bolt';

interface CardProps {
    title: string;
    description?: string;
    image?: string;
}

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const batteries_collection_id = import.meta.env.VITE_BATTERY_COLLECTION_ID

const Card = ({ station, client }: CardProps) => {

    const [slots, setSlots] = useState([]);
    const [hoveredBattery, setHoveredBattery] = useState(null);

    // Function to update a specific slot's battery level
    const updateBatteryLevel = (batteryId, newLevel) => {
        setSlots((currentSlots) => currentSlots.map(slot => {
            if (slot.battery && slot.battery.$id === batteryId) {
                return { ...slot, battery: { ...slot.battery, charge_level: newLevel } };
            }
            return slot;
        }));
    };

    useEffect(() => {
        // // Sort the slots initially
        setSlots(station.slots.slice().sort((a, b) => a.order_in_grid - b.order_in_grid));

        // // Construct an array of channels to subscribe to based on battery IDs
        // const channels = station.slots
        //     .filter(slot => slot.battery && slot.battery.$id)
        //     .map(slot => `databases.${database_id}.collections.${batteries_collection_id}.documents.${slot.battery.$id}`);

        // if (channels.length > 0) {
        // const unsubscribe = client.subscribe(`databases.${database_id}.collections.${batteries_collection_id}.documents`, (response) => {
        //     updateBatteryLevel(response.payload.$id, response.payload.charge_level);
        // });

        // return () => {
        //     console.log('Unsubscribing');
        //     unsubscribe();
        // };
        // }
    }, [station.slots, client]);

    // Function to handle mouse entering a cell
    const handleMouseEnter = (battery) => {
        setHoveredBattery(battery);
    };

    // Function to handle mouse leaving a cell
    const handleMouseLeave = () => {
        setHoveredBattery(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <h1>{station.name}</h1>
                {/* <OnlineStatusIndicator /> */}
            </div>
            <div className={styles.row} style={{
                height: "500px"
            }}>
                <div className={styles.cardSection} style={{
                    backgroundColor: "rgba(50,55,64,1)",
                    borderTopLeftRadius: "15px",
                    borderBottomLeftRadius: "15px"
                }}>
                    <Grid>
                        {slots.map((slot, index) => {
                            const batteryLevel = slot.battery ? `${Math.floor(slot.battery.charge_level)}%` : 'Free';
                            return (
                                <motion.div
                                    className={styles.cell}
                                    key={index}
                                    onHoverStart={() => handleMouseEnter(slot.battery)}
                                    onHoverEnd={handleMouseLeave}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Bolt percentage={slot.battery?.charge_level} />
                                    {batteryLevel}
                                </motion.div>
                            );
                        })}
                    </Grid>
                </div>
                <div className={styles.cardSection} style={{
                    backgroundColor: "rgba(89,98,105,1)",
                    borderTopRightRadius: "15px",
                    borderBottomRightRadius: "15px",
                    overflow: "hidden"
                }}>
                    <div style={{ display: "flex", minHeight: "30%" }}>
                        <AnimatePresence mode="wait">
                            {hoveredBattery ? (
                                <motion.div
                                    key="battery"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2>{hoveredBattery.$id}</h2>
                                    <p>{hoveredBattery.drone_model}</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="station"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2>{station.name}</h2>
                                    <p>{station.description || 'No description available'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div style={{ display: "flex", minHeight: "70%" }}>
                        <AnimatePresence mode="wait">
                            {hoveredBattery ? (
                                <motion.div
                                    key="batteryDetails"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p>Capacity: {hoveredBattery.capacity}</p>
                                    {hoveredBattery.warning && <p>Warning: {hoveredBattery.warning}</p>}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="stationDetails"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p>Additional station information here</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Card;