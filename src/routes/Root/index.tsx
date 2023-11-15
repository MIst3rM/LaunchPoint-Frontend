import { useState } from "react";
import { motion } from "framer-motion";
import { Content, Section, Counter, Header, Hero, HealthStatusIndicator, OnlineStatusIndicator, Sidebar, Ticker } from "../../components";
import textConstants from "../../textConstants";

import styles from "./styles.module.css";

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

  const colors = ['#632bf3', '#f122c8', '#f16022', '#9ef344', '#44d3f3'];

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
              <Ticker
                duration={20}
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
                isPlaying={isPlaying}
              >
                {colors.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: item,
                      margin: '5px',
                      height: '250px',
                      width: '200px',
                      borderRadius: '15px',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Ticker>
            </Section>
          </Section>
        </Content>
      }
    </>
  );
};

export default Root;