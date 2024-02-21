import { useEffect, useState } from "react";
import { motion, useIsPresent, Reorder } from "framer-motion";
import { Content, Section, Counter, Header, Hero, HealthStatusIndicator, OnlineStatusIndicator, Sidebar, Ticker, DownArrow, TickerCard } from "../../components";
import textConstants from "../../textConstants";
import styles from "./styles.module.css";
import { RootRouteProps } from "../../types";

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

const Root = ({ loggedInUser } : RootRouteProps) => {
  const isPresent = useIsPresent();

  //TODO: Replace this with a proper API call to get the total number of stations
  const [totalStations, setTotalStations] = useState(100);

  //TODO: Replace this with a proper API call to get the number of active stations
  const [onlineStations, setOnlineStations] = useState(52);

  const [totalStationsDigitsArray, setTotalStationsDigitsArray] = useState(String(totalStations).padStart(3, '0').split('').map(Number));
  const [onlineStationsDigitsArray, setOnlineStationsDigitsArray] = useState(String(onlineStations).padStart(3, '0').split('').map(Number));

  //TODO: Replace this with a proper API call to get the health percentage of the entire system
  const [systemHealth, setSystemHealth] = useState((onlineStations / totalStations) * 100);

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

  useEffect(() => {
    if (isTickerSectionExpanded) {
      setCardsContainerHeight(expandedHeight);
    } else {
      setCardsContainerHeight("");
    }
  }, [isTickerSectionExpanded]);


  const tickerSlots = Array.from({ length: 5 }).map((_, index) => {

    const tickerCardStyle = {
      width: "300px",
      height: "350px",
      borderRadius: "15px",
      backgroundColor: "rgb(44, 50, 60)",
    };

    return (
      <TickerCard
        key={index}
        id={`${index + 1}`}
        style={tickerCardStyle} />
    )
  });

  return (
    <>
      <Header />
      {!loggedInUser &&
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
      }
      {loggedInUser &&
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
                <OnlineStatusIndicator />
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
                <DownArrow isExpanded={isTickerSectionExpanded} handleClick={handleArrowClick} />
              </Section>
            </Section>
          </Section>
        </Content>
      }
      {/* <motion.div
      className={styles.privacyScreen}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
      /> */}
    </>
  );
};

export default Root;