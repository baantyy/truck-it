import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import AuthHeader from "../../common/AuthHeader"

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
        document.title = 'All Bookings | Admin'
        const { user } = this.props
        axios.get("/api/admin/bookings", {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    booking: res.data,
                    filteredBookings: res.data,
                    filteredSearch: res.data
                }))
            })
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredBookings: prevState.filteredSearch.filter(booking => booking.pickup.toLowerCase().includes(value.toLowerCase()) || booking.dropoff.toLowerCase().includes(value.toLowerCase()) || booking.user.fullname.toLowerCase().includes(value.toLowerCase()) || booking.user.email.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    cancelBooking = (id) => {
        const { user } = this.props
        axios.put(`/api/admin/bookings/${id}`, {status: false}, {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                if(res.data.booking){
                    if(res.data.booking.status === false){
                        this.setState((prevState) => ({
                            bookings: prevState.bookings.map(booking => booking._id === id ? {...booking, ...{status: false}} : booking),
                            filteredBookings: prevState.filteredBookings.map(booking => booking._id === id ? {...booking, ...{status: false}} : booking),
                            filteredSearch: prevState.filteredSearch.map(booking => booking._id === id ? {...booking, ...{status: false}} : booking)
                        }))
                    }
                }else{
                    console.log(res.data)
                }
            })
    }
    
    render(){
        const { filteredBookings, search } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <div className="inlineHeading">                                
                                <h1>All Bookings ({filteredBookings.length})</h1>
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
                                            <th>Pickup Date</th>
                                            <th>Customer Name</th>
                                            <th>Customer Email</th>
                                            <th>Pickup Address</th>
                                            <th>Dropoff Address</th>
                                            <th>Status</th>
                                            <th className="box" style={{width: '200px'}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredBookings.length ?
                                            filteredBookings.map((booking, index) => {
                                                return (
                                                    <tr key={ booking._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ booking.pickup_date }</td>
                                                        <td>{ booking.user.fullname }</td>
                                                        <td>{ booking.user.email }</td>
                                                        <td>{ booking.pickup }</td>
                                                        <td>{ booking.dropoff }</td>
                                                        <td>{ booking.status ? <span className="text-success">Scheduled</span> : <span className="text-danger">Cancelled</span> }</td>
                                                        <td className="text-center">
                                                            <Link className="view box" 
                                                                  title="View" 
                                                                  to={`/admin/bookings/${booking._id}`}
                                                            >View</Link>
                                                            <Link className="view box" 
                                                                  title="View" 
                                                                  to={`/admin/bookings/edit/${booking._id}`}
                                                            >Edit</Link>
                                                            { booking.status &&
                                                                <button className="del box"
                                                                        onClick={() => {
                                                                        this.cancelBooking(booking._id)
                                                                    }}>
                                                                    Cancel
                                                                </button>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="8" className="text-center">No Bookings Found</td></tr>
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
        user: state.user
    }
}

export default connect(mapStateToProps)(ViewAll)