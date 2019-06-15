import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import AuthHeader from "../../common/AuthHeader"

class ViewOne extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            booking: {},
            isLoaded: false
        }
    }

    componentDidMount(){
        document.title = "Booking Details"
        const { user, match } = this.props
        const id = match.params.id
        axios.get(`/api/vendors/bookings/${id}`,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    booking: res.data,
                    isLoaded: true
                }))
            })
    }
    
    render(){
        const { booking, isLoaded } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link className="edit" to="/vendor">Back</Link></li>
                            </ul>
                            { isLoaded &&
                            <div className="row">
                                <div className="col-lg-6">
                                    <h1>Booking Details</h1>
                                    <div className="viewBox">
                                        <ul>
                                            <li><b>Pickup</b> : { booking.pickup }</li>
                                            <li><b>Dropoff</b> : { booking.dropoff }</li>
                                            <li><b>Status</b> : { booking.status ? <span className="text-success">Scheduled</span> : <span className="text-danger">Cancelled</span> }</li>
                                            <li><b>Booked On</b> : { booking.bookedAt }</li>
                                            <li><b>Pickup Date</b> : { booking.pickup_date }</li>
                                            <li><b>Volume</b> : { booking.volume }</li>
                                            <li><b>Distance</b> : { booking.distance.text }</li>
                                            <li><b>Duration</b> : { booking.duration.text }</li>
                                            <li><b>Estimated Cost</b> : { 'Rs. ' + booking.amount + '/-' }</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h1>Selected Truck</h1>
                                    <div className="viewBox">
                                        <ul>
                                            <li><b>Name</b> : { booking.truck.name }</li>
                                            <li><b>Dimension</b> : { booking.truck.dimension._length + 'ft. x' + booking.truck.dimension._breadth + 'ft. x' + booking.truck.dimension._height + 'ft.'  }</li>
                                            <li><b>Capacity</b> : { booking.truck.capacity + 'Kg' }</li>
                                            <li><img src={ booking.truck.image } alt="" style={{maxWidth: '100%', marginTop: '20px', height: '186px'}} /></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h1>Customer Details</h1>
                                    <div className="viewBox">
                                        <ul>
                                            <li><b>Name</b> : { booking.user.fullname }</li>
                                            <li><b>Email</b> : { booking.user.email }</li>
                                            <li><b>Mobile</b> : { booking.user.mobile }</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ViewOne)