import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateScreen } from "../../actions/Screen"

class Header extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            headerClass: ""
        }
    }

    componentWillMount(){
        this.updateScreen()
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.updateScreen)
    }
    
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.updateScreen)
    }
    
    handleScroll = (e) => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop
        if(scrollTop > 60){
            this.setState(() => ({ headerClass: "bg" }))
        }else{
            this.setState(() => ({ headerClass: "" }))
        }
    }

    updateScreen = () => {
        this.props.dispatch(updateScreen({
            width: window.innerWidth,
            height: window.innerHeight
        }))
    }

    render(){
        const { user } = this.props
        return (
            <header className={this.state.headerClass}>
                <div className="container">
                    <nav className="navbar navbar-expand-lg">
                        <Link className="navbar-brand" to="/">TRUCKIT</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                            <img src={`${window.location.origin}/img/menu.png`} alt="" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbar">
                            <ul className="navbar-nav ml-auto">
                                
                                <li className="nav-item">
                                    <a className="nav-link" href="/#home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/#services">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/#about">About Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/#contact">Contact Us</a>
                                </li>

                                { user.role ? 
                                    <React.Fragment>
                                        <li className="nav-item">
                                            <Link className="nav-link highlight" to={`/${user.role}`}>My Account</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link highlight logout" to={`/logout`}>Logout</Link>
                                        </li>
                                    </React.Fragment> : 
                                    <li className="nav-item">
                                        <Link className="nav-link highlight" to="/login">Login</Link>
                                    </li>
                                }
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        screen: state.screen
    }
}

export default connect(mapStateToProps)(Header)