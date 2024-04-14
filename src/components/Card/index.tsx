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

    const [latitude, longitude] = station.coordinates.split(/(?<=N|S) /);

    // Function to update a specific slot's battery level
    const updateBatteryLevel = (batteryId, newLevel) => {
        setSlots((currentSlots) => currentSlots.map(slot => {
            if (slot.battery && slot.battery.$id === batteryId) {
                return { ...slot, battery: { ...slot.battery, charge_level: newLevel } };
            }
            return slot;
        }));
    };

    const formatDroneModel = (model) => {
        return model
            .split('_') // Split the string into an array of words based on underscores
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word and lowercase the rest
            .join(' '); // Join the array back into a single string with spaces
    };

    const getBatteryStatusMessage = (status) => {
        switch (status) {
            case 'UNAVAILABLE':
                return 'Battery is currently unavailable';
            case 'MAINTENANCE_NEEDED':
                return 'Battery requires maintenance';
            case 'AVAILABLE':
            default:
                return 'Battery is available for use';
        }
    };

    useEffect(() => {
        // // Sort the slots initially
        console.log(station)
        setSlots(station.slots.slice().sort((a, b) => a.order_in_grid - b.order_in_grid));

        // const unsubscribe = client.subscribe(`databases.${database_id}.collections.${batteries_collection_id}.documents`, (response) => {
        //     updateBatteryLevel(response.payload.$id, response.payload.charge_level);
        // });

        // return () => {
        //     console.log('Unsubscribing');
        //     unsubscribe();
        // };
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
                <OnlineStatusIndicator status={station.status} position={`flex-start`} />
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
                    <div style={{ display: "flex", width: "100%", height: "100%" }}>
                        <AnimatePresence mode="wait">
                            {hoveredBattery ? (
                                <motion.div
                                    key="battery"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                                >
                                    <span style={{ alignSelf: "flex-start", fontWeight: 600, lineHeight: 2.5 }}>{getBatteryStatusMessage(hoveredBattery.status)}</span>
                                    <span style={{ alignSelf: "flex-end" }}>{`Drone Model: ${formatDroneModel(hoveredBattery.drone_model)}`}</span>
                                    <span style={{ alignSelf: "flex-end" }}>{`Capacity: ${hoveredBattery.capacity} mAh`}</span>
                                    <h3>History</h3>
                                    <div className={styles.historySection}></div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="station"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                                >
                                    <span style={{ alignSelf: "flex-end" }}>{latitude}</span>
                                    <span style={{ alignSelf: "flex-end" }}>{longitude}</span>
                                    <h3>History</h3>
                                    <div className={styles.historySection}></div>
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