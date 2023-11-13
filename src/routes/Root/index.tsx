import { useState } from "react";
import Content from "../../components/Container/Content";
import Section from "../../components/Container/Section";
import Counter from "../../components/Counter";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import textConstants from "../../textConstants";

import styles from "./styles.module.css";
import HealthStatusIndicator from "../../components/Status/HealthStatusIndicator";

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

  const sectionHoverEffect = {
    whileHover: {
      scale: 1.05,
      transition: {
        duration: 0.5,
        ease: 'linear'
      }
    },
  }
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
                <h3>{textConstants.dashboardOverviewPage.total_stations}</h3>
                <Counter targetDigits={totalStationsDigitsArray} />
                <h3>{textConstants.dashboardOverviewPage.active_stations}</h3>
                <Counter targetDigits={onlineStationsDigitsArray} />
              </Section>

              <Section
                customProps={{
                  classes: [styles.table],
                  effects: sectionHoverEffect
                }}>
                <h1>{textConstants.dashboardOverviewPage.system_health}</h1>
                <HealthStatusIndicator healthPercentage={systemHealth} />

              </Section>
            </Section>
          </Section>
        </Content>
      }
    </>
  );
};

export default Root;