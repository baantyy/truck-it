import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import AuthHeader from "../../common/AuthHeader"

class Edit extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            vendors: [],
            vendor: null,
            allStatus: [
                {label: 'Active', value: true}, 
                {label: 'Inactive', value: false}
            ],
            status: null,
            isLoaded: false
        }
    }

    componentDidMount(){
        const { user, match } = this.props
        document.title = "Edit Booking Details"
        axios.get("/api/admin/users/role/vendor",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    vendors: res.data.map(vendor => ({label: vendor.fullname, value: vendor._id}))
                }))
            })
        
        const id = match.params.id
        axios.get(`/api/admin/bookings/${id}`,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    vendor: res.data.vendor ? { label: res.data.vendor.fullname, value: res.data.vendor._id } : null,
                    isLoaded: true,
                    status: { label: res.data.status ? 'Active' : 'Inactive', value: res.data.status }
                }))
            })
    }

    handleVendorSelect = (option) => {
        this.setState(() => ({
            vendor: option
        }))
    }

    handleStatusSelect = (option) => {
        this.setState(() => ({
            status: option
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { vendor, status } = this.state
        const { user, match, history } = this.props
        const id = match.params.id
        const formData = {
            vendor: vendor ? vendor.value : null,
            status: status.value
        }
        axios.put(`/api/admin/bookings/${id}`, formData, {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                if(res.data.booking){
                    history.push(`/admin/bookings/${id}`)
                }else{
                    console.log(res.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render(){
        const { vendors, vendor, allStatus, status } = this.state
        const id = this.props.match.params.id
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link to={`/admin/bookings/${id}`}>View</Link></li>
                                <li><Link className="edit" to="/admin">Back</Link></li>
                            </ul>
                            <div className="row">
                                <div className="col-lg-6">
                                    { vendors.length > 0 &&
                                        <React.Fragment>
                                            <h1>Edit Booking Details</h1>
                                            <form className="form" onSubmit={this.handleSubmit}>
                                                <label className="label">Vendors</label>
                                                <Select options={vendors} 
                                                        onChange={this.handleVendorSelect} 
                                                        value={vendor}
                                                    />

                                                <label className="label">Status</label>
                                                <Select options={allStatus} 
                                                        onChange={this.handleStatusSelect} 
                                                        value={status}
                                                    />
                                                <button className="button">Update</button>
                                            </form>
                                        </React.Fragment>
                                    }
                                </div>
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

export default connect(mapStateToProps)(Edit)