import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import AuthHeader from "../../common/AuthHeader"

import { removeBooking } from "../../../actions/Booking"

class ViewAll extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bookings: [],
            filteredBookings: [],
            filteredSearch: [],
            search: ""
        }
    }

    componentDidMount(){
        document.title = 'All Bookings'
        this.getBookings()
        const { user, booking } = this.props
        if(booking.status){
            axios.post("/api/users/bookings", booking, {
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    if(res.data.booking){
                        this.props.dispatch(removeBooking())
                        this.getBookings()
                    }else{
                        console.log(res.data)
                    }
                })
        }
    }

    getBookings = () => {
        const { user } = this.props
        axios.get("/api/users/bookings", {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    booking: res.data,
                    filteredBookings: res.data
                }))
            })
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredBookings: prevState.filteredSearch.filter(booking => booking.pickup.toLowerCase().includes(value.toLowerCase()) || booking.dropoff.toLowerCase().includes(value.toLowerCase()))
        }))
    }
    
    render(){
        const { filteredBookings, search } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <h1>All Bookings ({filteredBookings.length})</h1>
                            <div className="inlineHeading">
                                {/* <ul className="topLinks text-left mb-0" style={{width: 'auto'}}>
                                    <li>
                                        <Link to="/customer/bookings/add">Add New</Link>
                                    </li>
                                </ul> */}
                                <input type="text" 
                                       placeholder="Search Here"
                                       onChange={this.handleSearch}
                                       value={search}
                                    />
                            </div>
                            <div className="tableBox">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sl. No.</th>
                                            <th>Booked On</th>
                                            <th>Pickup</th>
                                            <th>Dropoff</th>
                                            <th>Pickup Date</th>
                                            <th>Estimated Cost</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredBookings.length ?
                                            filteredBookings.map((booking, index) => {
                                                return (
                                                    <tr key={ booking._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ booking.bookedAt }</td>
                                                        <td>{ booking.pickup }</td>
                                                        <td>{ booking.dropoff }</td>
                                                        <td>{ booking.pickup_date }</td>
                                                        <td>{ 'Rs. ' + booking.amount + '/-' }</td>
                                                        <td className="text-center">
                                                            <Link className="view" 
                                                                  title="View" 
                                                                  to={`/customer/bookings/${booking._id}`}
                                                            ><i className="fas fa-book"></i></Link>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="7" className="text-center">No Bookings Found</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        booking: state.booking
    }
}

export default connect(mapStateToProps)(ViewAll)