import Content from './components/Container/Content'
import Section from './components/Container/Section'
import Header from './components/Header'
import Hero from './components/Hero'

import textConstants from './textConstants'

function App() {
  const styling = {
    width: '50%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  }

  return (
    <>
      <Header />
      <Content>
        <Section customStyles={styling}>
          <Hero
            title={textConstants.landingPage.title}
            subtitle={textConstants.landingPage.subtitle}
          >

          </Hero>
        </Section>
      </Content>
    </>
  )
}

export default App
