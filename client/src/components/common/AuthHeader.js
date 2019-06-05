import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const AuthHeader = (props) => {

    const { user } = props
    return (
        <header className="bg header">
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <Link className="navbar-brand" to="/">TRUCKIT</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <img src={`${window.location.origin}/img/menu1.png`} alt="" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav ml-auto">

                            { user.role === "customer" ?

                                <React.Fragment>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/customer">Bookings</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/customer/my-profile">My Profile</Link>
                                    </li>
                                </React.Fragment> : user.role === "vendor" ?

                                <React.Fragment>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/vendor">Bookings</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/vendor/vehicles">Vehicles</Link>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link className="nav-link" to="/vendor/reviews">Reviews</Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/vendor/my-profile">My Profile</Link>
                                    </li>
                                </React.Fragment> : user.role === "admin" &&

                                <React.Fragment>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Bookings</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin/vehicles">Vehicles</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin/users">Users</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin/contacts">Messages</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/admin/users/${user.id}`}>My Profile</Link>
                                    </li>
                                </React.Fragment> 

                            }
                            <li className="nav-item">
                                <Link className="nav-link highlight logout" to={`/logout`}>Logout</Link>
                            </li>

                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AuthHeader)