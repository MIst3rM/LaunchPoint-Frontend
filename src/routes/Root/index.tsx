import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Content, Section, Counter, Header, Hero, HealthStatusIndicator, OnlineStatusIndicator, Sidebar, Ticker } from "../../components";
import textConstants from "../../textConstants";

import styles from "./styles.module.css";
import DownArrow from "../../components/Arrow/DownArrow";

const colors = ['#632bf3', '#b700ff', '#f16022', '#9ef344', '#44d3f3'];

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

const Root = () => {
  //TODO: Replace this with a proper authentication check
  const [isSignedIn, setIsSignedIn] = useState(true);

  //TODO: Replace this with a proper API call to get the total number of stations
  const [totalStations, setTotalStations] = useState(100);

  //TODO: Replace this with a proper API call to get the number of active stations
  const [onlineStations, setOnlineStations] = useState(52);

  const [totalStationsDigitsArray, setTotalStationsDigitsArray] = useState(String(totalStations).padStart(3, '0').split('').map(Number));
  const [onlineStationsDigitsArray, setOnlineStationsDigitsArray] = useState(String(onlineStations).padStart(3, '0').split('').map(Number));

  //TODO: Replace this with a proper API call to get the health percentage of the entire system
  const [systemHealth, setSystemHealth] = useState((onlineStations / totalStations) * 100);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true)

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

  const tickerSlots = colors.map((item, index) => (
    <div
      key={index}
      style={{
        width: '200px',
        height: '250px',
        backgroundColor: item,
        borderRadius: '15px',
        cursor: 'pointer'
      }}
    />
  ));

  return (
    <>
      <Header />
      {!isSignedIn &&
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
      {isSignedIn &&
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
                <Ticker
                  slots={tickerSlots}
                  gap={24}
                  padding={10}
                  direction={"right"}
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
    </>
  );
};

export default Root;