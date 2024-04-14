import { useEffect, useState } from "react";
import { motion, useIsPresent, Reorder } from "framer-motion";
import { Content, Section, Counter, Header, Hero, HealthStatusIndicator, Sidebar, Ticker, DownArrow, TickerCard, Notification, TextSpinnerLoader } from "../../components";
import textConstants from "../../textConstants";
import styles from "./styles.module.css";
import { RootRouteProps } from "../../types";
import { Outlet } from "react-router-dom";
import { useStations } from "../../providers/database";
import { useAuth } from "../../providers/auth";

import { Databases, Query } from "appwrite";

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const stations_collection_id = import.meta.env.VITE_STATION_COLLECTION_ID
const maintenance_collection_id = import.meta.env.VITE_MAINTENANCE_COLLECTION_ID

const sectionHoverEffect = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: 0.5,
      ease: 'linear'
    }
  },
}

const sidebarVariants = {
  open: {
    x: -250,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  closed: {
    x: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
}

const Root = ({ loggedInUser }: RootRouteProps) => {
  const isPresent = useIsPresent();
  const { client } = useAuth();
  const databases = new Databases(client);

  const [notifications, setNotifications] = useState([]);
  const [tickerSlots, setTickerSlots] = useState([]);
  const { totalStationsDigitsArray, onlineStationsDigitsArray, systemHealth } = useStations();

  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isTickerSectionExpanded, setIsTickerSectionExpanded] = useState(false);

  const [cardsContainerHeight, setCardsContainerHeight] = useState("");
  const expandedHeight = "1000px";

  const sectionExpandEffect = {
    animate: { height: cardsContainerHeight },
    transition: { duration: 0.5 }
  }

  const handleArrowClick = () => {
    setIsTickerSectionExpanded(!isTickerSectionExpanded)
  }

  const tickerCardStyle = {
    width: "300px",
    height: "350px",
    borderRadius: "15px",
    backgroundColor: "rgb(44, 50, 60)",
  };

  useEffect(() => {
    if (isTickerSectionExpanded) {
      setCardsContainerHeight(expandedHeight);
    } else {
      setCardsContainerHeight("");
    }
  }, [isTickerSectionExpanded]);

  useEffect(() => {
    if (loggedInUser) {
      const promise = databases.listDocuments(
        database_id,
        maintenance_collection_id,
        [
          Query.equal('seen', false),
        ]
      );

      promise.then(response => {
        setNotifications(response.documents);
      }).catch(error => {
        console.log(error);
      });

      const unsubscribe = client.subscribe(`databases.${database_id}.collections.${maintenance_collection_id}.documents`, (response) => {
        if (!response.payload.seen) {
          setNotifications(currentNotifications => [...currentNotifications, response.payload]);
        }
      });

      return () => {
        console.log('Unsubscribing');
        unsubscribe();
      };
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (totalStationsDigitsArray.length > 0 && onlineStationsDigitsArray.length > 0 && systemHealth > 0 && tickerSlots.length > 0) {
      setIsAllDataLoaded(true);
    }
  }, [totalStationsDigitsArray, onlineStationsDigitsArray, systemHealth, tickerSlots, loggedInUser]);

  const handleNotificationClose = (notification_id) => {

    databases.updateDocument(database_id, maintenance_collection_id, notification_id, {
      seen: true
    });

    setNotifications(notifications.filter(notification => notification.$id !== notification_id));
  }

  useEffect(() => {
    if (loggedInUser) {
      const promise = databases.listDocuments(
        database_id,
        stations_collection_id
      );

      promise.then(response => {
        const slots = response.documents.map((station, index) => {
          return (
            <TickerCard
              key={station.$id}
              data={station}
              style={tickerCardStyle}
            />
          )
        });

        setTickerSlots(slots);
      }).catch(error => {
        console.log(error);
      });
    }
  }, [loggedInUser]);

  return (
    <>
      <Header />
      <Outlet />
      {!loggedInUser ? (
        <Content>
          <Section customProps={{
            classes: [styles.signedOut]
          }}>
            <Hero
              title={textConstants.landingPage.title}
              subtitle={textConstants.landingPage.subtitle}
            >
            </Hero>
          </Section>
        </Content>
      ) :
        isAllDataLoaded ? (
          <Content>
            <Section customProps={{
              classes: [styles.signedIn]
            }}>
              <Section customProps={{
                classes: [styles.row]
              }}>
                <Section
                  customProps={{
                    classes: [styles.stationsOverview],
                    effects: sectionHoverEffect
                  }}
                >
                  <h3>{textConstants.dashboardOverviewPage.total_stations}</h3>
                  <Counter targetDigits={totalStationsDigitsArray} />
                  <h3>{textConstants.dashboardOverviewPage.active_stations}</h3>
                  <Counter targetDigits={onlineStationsDigitsArray} />
                </Section>

                <Section
                  customProps={{
                    classes: [styles.systemHealth],
                    effects: sectionHoverEffect
                  }}>
                  <Sidebar openSidebar={setIsSidebarOpen} />
                  <motion.h1
                    variants={sidebarVariants}
                    initial={false}
                    animate={isSidebarOpen ? "open" : "closed"}
                  >
                    {textConstants.dashboardOverviewPage.system_health}
                  </motion.h1>
                  <HealthStatusIndicator
                    healthPercentage={systemHealth}
                    isSidebarOpen={isSidebarOpen}
                  />
                </Section>
              </Section>
              <Section customProps={{
                classes: [styles.row]
              }}>
                <Section
                  customProps={{
                    classes: [styles.cardsContainer],
                    effects: sectionExpandEffect,
                  }}
                >
                  <h1
                    className={styles.cardsContainerHeader}>
                    {textConstants.dashboardOverviewPage.stations}
                  </h1>
                  <Ticker
                    slots={tickerSlots}
                    gap={24}
                    padding={10}
                    direction={"left"}
                    speed={100}
                    hoverFactor={0.5}
                    alignment={"center"}
                  />
                </Section>
              </Section>
            </Section>
          </Content>
        ) : (
          <TextSpinnerLoader />
        )}
      <Notification notifications={notifications} updateNotifications={handleNotificationClose} />
    </>
  );
};

export default Root;