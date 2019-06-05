import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import AuthHeader from "../../common/AuthHeader"
import Form from "./Form"

class Add extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isSubmitting: false,
            errors: {}
        }
    }

    componentDidMount(){
        document.title = 'Add Vehicle'
    }

    handleSubmit = (formdata) => {
        const { user, history } = this.props
        this.setState(() => ({
            isSubmitting: true
        }))        
        axios.post(`/api/admin/vehicles/`,formdata,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    isSubmitting: false
                }))
                if(res.data.success){
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
        const { isSubmitting, errors } = this.state
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
                                    <h1>Add Vehicle</h1>
                                    <Form isSubmitting={isSubmitting}
                                          handleSubmit={this.handleSubmit}
                                          errors={errors}
                                        />
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

export default connect(mapStateToProps)(Add)