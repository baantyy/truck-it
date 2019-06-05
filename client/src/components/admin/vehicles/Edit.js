import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import AuthHeader from "../../common/AuthHeader"
import Form from "./Form"

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            vehicle: {},
            errors: {},
            isSubmitting: false,
            status: false
        }
    }

    componentDidMount(){
        const { user, match } = this.props
        const id = match.params.id
        axios.get(`/api/admin/vehicles/${id}`, {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    vehicle: res.data,
                    status: true
                }))
                document.title = res.data.name 
            })
    }

    handleSubmit = (formdata) => {
        const { user, history, match } = this.props
        this.setState(() => ({
            isSubmitting: true
        }))        
        axios.put(`/api/admin/vehicles/${match.params.id}`,formdata,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    isSubmitting: false
                }))
                if(res.data.success){
                    //history.push(`/admin/vehicles/${res.data.success._id}`)
                    history.push(`/admin/vehicles`)
                }else{
                    this.setState(() => ({
                        errors: res.data.errors
                    }))
                }
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render(){
        const { isSubmitting, errors, vehicle, status } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link className="edit" to="/admin/vehicles">Back</Link></li>
                            </ul>
                            <div className="row">
                                <div className="col-lg-6 offset-lg-3">
                                    <h1>Edit Vehicle</h1>
                                    { status && 
                                        <Form isSubmitting={isSubmitting}
                                            handleSubmit={this.handleSubmit}
                                            errors={errors}
                                            vehicle={vehicle}
                                            />
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