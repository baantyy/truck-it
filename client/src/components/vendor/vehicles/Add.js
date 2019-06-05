import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import AuthHeader from "../../common/AuthHeader"
import Form from "./Form"

class Add extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            errors: {},
            isSubmitting: false
        }
    }

    componentDidMount(){
        document.title = "Add vehicle | Vendor"
    }

    handleSubmit = (formdata) => {
        const { user, history } = this.props
        this.setState(() => ({
            isSubmitting: true
        }))
        axios.post("/api/vendors/vehicles", formdata, {
                headers: { 'x-auth' : user.token}
            })
            .then(res => {
                if(res.data.success){
                    history.push("/vendor/vehicles")
                }else{
                    this.setState(() => ({
                        isSubmitting: false,
                        errors: res.data.errors.vehicles.errors
                    }))
                }
            })
    }

    render(){
        const { errors, isSubmitting } = this.state
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
                            <h1>Add Vehicle</h1>                                    
                            <Form handleSubmit={this.handleSubmit}
                                    errors={errors}
                                    user={user}
                                    isSubmitting={isSubmitting}
                                    page="add"
                                />
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

export default connect(mapStateToProps)(Add)