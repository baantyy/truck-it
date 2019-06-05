import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import AuthHeader from "../../common/AuthHeader"

class ViewAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            vehicles: [],
            filteredVehicles: [],
            filteredSearch: [],
            search: ""
        }
    }

    componentDidMount(){
        document.title = 'Vehicles | Vendor'
        const { user } = this.props
        axios.get("/api/vendors/vehicles",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    vehicles: res.data,
                    filteredVehicles: res.data,
                    filteredSearch: res.data
                }))
            })
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredVehicles: prevState.filteredSearch.filter(vehicle => vehicle.number_plate.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    handleDelete = (id) => {
        const { user } = this.props
        if(window.confirm("Are you sure ?")){
            axios.delete(`/api/vendors/vehicles/${id}`,{
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    if(res.data.success){
                        this.setState((prevState) => ({
                            vehicles: prevState.vehicles.filter(vehicle => vehicle._id !== id),
                            filteredVehicles: prevState.filteredVehicles.filter(vehicle => vehicle._id !== id),
                            filteredSearch: prevState.filteredSearch.filter(vehicle => vehicle._id !== id)
                        }))
                    }else{
                        console.log(res.data)
                    }
                })
        }
    }
    
    render(){
        const { search, filteredVehicles } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <h1>All Vehicles ({filteredVehicles.length})</h1>
                            <div className="inlineHeading">
                                <ul className="topLinks text-left mb-0" style={{width: 'auto'}}>
                                    <li>
                                        <Link to="/vendor/vehicles/add">Add New</Link>
                                    </li>
                                </ul>
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
                                            <th rowSpan="2">Sl. No.</th>
                                            <th rowSpan="2">Vehicle Number</th>
                                            <th colSpan="2">Intercity Pricing</th>
                                            <th colSpan="2">Intracity Pricing</th>
                                            <th rowSpan="2">Helper Rate</th>
                                            <th rowSpan="2">Action</th>
                                        </tr>
                                        <tr>
                                            <th>Per KM</th>
                                            <th>Per Min</th>
                                            <th>Per KM</th>
                                            <th>Per Min</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredVehicles.length ?
                                            filteredVehicles.map((vehicle, index) => {
                                                return (
                                                    <tr key={ vehicle._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ vehicle.number_plate }</td>
                                                        <td>{ (vehicle.pricing && vehicle.pricing.inter_city && vehicle.pricing.inter_city.ratePerKm) && vehicle.pricing.inter_city.ratePerKm + '/-' }</td>
                                                        <td>{ (vehicle.pricing && vehicle.pricing.inter_city && vehicle.pricing.inter_city.ratePerMin) && vehicle.pricing.inter_city.ratePerMin + '/-' }</td>
                                                        <td>{ (vehicle.pricing && vehicle.pricing.intra_city && vehicle.pricing.intra_city.ratePerKm) && vehicle.pricing.intra_city.ratePerKm + '/-' }</td>
                                                        <td>{ (vehicle.pricing && vehicle.pricing.intra_city && vehicle.pricing.intra_city.ratePerMin) && vehicle.pricing.intra_city.ratePerMin + '/-' }</td>
                                                        <td>{ vehicle.helper_rate + '/-' }</td>
                                                        <td>
                                                            <Link className="edit" 
                                                                  title="Edit" 
                                                                  to={`/vendor/vehicles/edit/${vehicle._id}`}
                                                            ><i className="fas fa-pen"></i></Link>

                                                            <button className="del"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        this.handleDelete(vehicle._id)
                                                                    }}
                                                            ><i className="fas fa-trash-alt"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="8" className="text-center">No Vehicles Found</td></tr>
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