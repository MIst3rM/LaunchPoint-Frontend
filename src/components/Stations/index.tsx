import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import styles from "./styles.module.css";
import Section from "../Container/Section";
import Content from "../Container/Content";
import Card from "../Card";
import { motion } from "framer-motion";
import { Client, Databases, Query } from "appwrite";

interface StationsProps {
    city: string;
    client: Client;
}

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const stations_collection_id = import.meta.env.VITE_STATION_COLLECTION_ID

const Station = ({ station, client }) => {
    return (
        <Content>
            <Section>
                <Card station={station} client={client}/>
            </Section>
        </Content>
    )
}

const Stations = ({ city, client }: StationsProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref);
    const [stations, setStations] = useState([])

    const databases = new Databases(client);

    useEffect(() => {
        const promise = databases.listDocuments(
            database_id,
            stations_collection_id,
            [
                Query.equal('location', city),
            ]
        );

        promise.then(response => {
            setStations(response.documents);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                transform: isInView ? "none" : "translateX(-200px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
            }}
        >
            <section className={styles.city} ref={ref}>
                <span>
                    {city}
                </span>
            </section>
            <motion.div
                className={styles.container}
                style={{ overflowY: stations.length > 1 ? "scroll" : "hidden" }}
            >
                {stations.map((station, index) => (
                    <Station key={station.$id} station={station} client={client} />
                ))}
            </motion.div>
        </div>

    );
}

export default Stations;