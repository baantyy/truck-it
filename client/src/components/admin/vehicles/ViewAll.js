import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import AuthHeader from "../../common/AuthHeader"
import { fileUrl } from "../../../config/config"

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
        document.title = 'Vehicles | Admin'
        const self = this
        const { user } = this.props

        function getAllVehicles() {
            return axios.get("/api/admin/vehicles",{
                        headers: { 'x-auth': user.token }
                    })
        }
        function getVendorVehicles(){
            return axios.get("/api/admin/vendors",{
                        headers: { 'x-auth': user.token }
                    })
        }
        axios.all([getAllVehicles(),getVendorVehicles()])
            .then(axios.spread(function (first,second) {

                const vehicleCount = {}
                second.data.forEach(vendor => vendor.vehicles.forEach(vehicle => {
                    if(vehicleCount.hasOwnProperty(vehicle.vehicle)){
                        vehicleCount[vehicle.vehicle]++
                    }else{
                        vehicleCount[vehicle.vehicle] = 1
                    }
                }))

                const vehicles = first.data.map(vehicle => vehicleCount.hasOwnProperty(vehicle._id) ? {...vehicle, ...{count: vehicleCount[vehicle._id]}} : vehicle)

                self.setState(() => ({
                    vehicles: vehicles,
                    filteredVehicles: vehicles,
                    filteredSearch: vehicles
                }))
            }))
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredVehicles: prevState.filteredSearch.filter(vehicle => vehicle.name.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    handleDelete = (id) => {
        const { user } = this.props
        if(window.confirm("Are you sure ?")){
            axios.delete(`/api/admin/vehicles/${id}`,{
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
                                        <Link to="/admin/vehicles/add">Add New</Link>
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
                                            <th>Sl. No.</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Dimension</th>
                                            <th>Capacity</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredVehicles.length ?
                                            filteredVehicles.map((vehicle, index) => {
                                                return (
                                                    <tr key={ vehicle._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ vehicle.name }</td>
                                                        <td>{ vehicle.image && <img src={fileUrl + vehicle.image} alt="" /> }</td>
                                                        <td>{ (vehicle.dimension && vehicle.dimension._length && vehicle.dimension._breadth && vehicle.dimension._height) && vehicle.dimension._length + ' ft. x ' + vehicle.dimension._breadth + ' x ft. ' + vehicle.dimension._height + ' ft. ' }</td>
                                                        <td>{ vehicle.capacity && (vehicle.capacity + ' kg') }</td>
                                                        <td>{ vehicle.count }</td>
                                                        <td>
                                                            <Link className="edit" 
                                                                  title="Edit" 
                                                                  to={`/admin/vehicles/edit/${vehicle._id}`}
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
                                            }) : <tr><td colSpan="7" className="text-center">No Vehicles Found</td></tr>
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