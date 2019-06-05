import React from 'react'

import Header from "../common/Header"
import Footer from "../common/Footer"

import Landing from './Landing'
import Services from './Services'
import About from './About'
import Contact from './Contact'

const Home = (props) => {

    document.title = 'TRUCKIT'
    
    return (
        <React.Fragment>
            <Header />
            <div className="wrapper">
                <div className="homepage" id="home">
                    <Landing />
                    <Services />
                    <About />
                    <Contact />
                </div>
            </div>
          <Footer />
        </React.Fragment>
    )
}

export default Home