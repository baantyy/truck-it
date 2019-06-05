import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import AuthHeader from "../../common/AuthHeader"
import Form from "./Form"

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            errors: {},
            isSubmitting: false,
            vehicle: {},
            isLoaded: false
        }
    }

    componentDidMount(){
        document.title = "Edit vehicle | Vendor"
        const { match, user } = this.props
        const id = match.params.id
        axios.get("/api/vendors/vehicles",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    vehicle: res.data.find(vehicle => vehicle._id === id),
                    isLoaded: true
                }))
            })
    }

    handleSubmit = (formdata) => {
        const { user, history, match } = this.props
        const id = match.params.id
        this.setState(() => ({
            isSubmitting: true
        }))
        axios.put(`/api/vendors/vehicles/${id}`, formdata, {
                headers: { 'x-auth' : user.token}
            })
            .then(res => {
                if(res.data.success){
                    history.push("/vendor/vehicles")
                }else{
                    this.setState(() => ({
                        isSubmitting: false,
                        errors: res.data.errors
                    }))
                }
            })
    }

    render(){
        const { errors, isSubmitting, vehicle, isLoaded } = this.state
        const { user } = this.props
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <div className="inlineHeading">
                                <ul className="topLinks">
                                    <li>
                                        <Link className="edit" to="/vendor/vehicles">Back</Link>
                                    </li>
                                </ul>
                            </div>
                            <h1>Edit Vehicle</h1>
                            { isLoaded && 
                                <Form handleSubmit={this.handleSubmit}
                                    errors={errors}
                                    user={user}
                                    isSubmitting={isSubmitting}
                                    _vehicle={vehicle}
                                    page="edit"
                                    />
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

export default connect(mapStateToProps)(Edit)