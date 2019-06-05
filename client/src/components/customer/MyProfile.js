import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import AuthHeader from "../common/AuthHeader"
import { updateUser } from "../../actions/User"

class MyProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            customer: {
                new_password: "",
                confirm_password: ""
            },
            isLoaded: false,
            errors: {
                fullname: "",
                email: "",
                mobile: "",
                password: ""
            },
            isSubmitting: false,
            passwordError: "",
            success: ""
        }
    }

    componentDidMount(){
        const { user } = this.props
        document.title = user.fullname 
        this.setState((prevState) => ({
            customer: {...prevState.customer, ...user},
            isLoaded: true
        }))
    }

    handleChange = (e) => {
        e.persist()
        const value = e.target.value
        this.setState((prevState) => ({
            customer: {...prevState.customer, ...{[e.target.name]: value}}
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { fullname, email, new_password, confirm_password, mobile } = this.state.customer
        const { user } = this.props
        if(new_password === confirm_password){
            this.setState(() => ({
                passwordError: "",
                isSubmitting: true
            }))
            const formdata = {
                fullname,
                email,
                password: new_password,
                mobile
            }
            axios.put(`/api/users/update_profile`,formdata,{
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    if(res.data.success){
                        this.setState((prevState) => ({
                            success: "Successfully Updated",
                            errors: {},
                            isSubmitting: false,
                            customer: {...prevState.customer, ...{new_password: "", confirm_password: ""}}
                        }))
                        delete formdata.password
                        this.props.dispatch(updateUser(formdata))
                    }else{
                        this.setState(() => ({
                            success: "",
                            errors: res.data.errors,
                            isSubmitting: false
                        }))
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }else{
            this.setState(() => ({
                passwordError: "Passwords don't match"
            }))
        }
    }

    render(){
        const { customer, isLoaded, errors, passwordError, isSubmitting, success } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6 offset-lg-3">
                                    { isLoaded &&
                                        <React.Fragment>
                                            <h1>Edit Profile</h1>
                                            <form className="form" onSubmit={this.handleSubmit}>
                                                { success && <p className="success">{ success }</p> }

                                                <label className="label">Fullname</label>
                                                <input type="text"
                                                       placeholder="Fullname"
                                                       className="field"
                                                       value={customer.fullname}
                                                       onChange={this.handleChange}
                                                       name="fullname" 
                                                    />
                                                { errors.fullname && <p className="error">{ errors.fullname.message }</p> }

                                                <label className="label">Email Id</label>
                                                <input type="email"
                                                       placeholder="Email Id"
                                                       className="field"
                                                       value={customer.email}
                                                       onChange={this.handleChange}
                                                       name="email" 
                                                    />
                                                { errors.email && <p className="error">{ errors.email.message }</p> }
                                                
                                                <label className="label">Mobile</label>
                                                <input type="text"
                                                       placeholder="Mobile"
                                                       className="field"
                                                       value={customer.mobile}
                                                       onChange={this.handleChange}
                                                       name="mobile" 
                                                    />
                                                { errors.mobile && <p className="error">{ errors.mobile.message }</p> }

                                                <label className="label">New Password</label>
                                                <input type="password"
                                                       placeholder="New Password"
                                                       className="field"
                                                       value={customer.new_password}
                                                       onChange={this.handleChange}
                                                       name="new_password" 
                                                    />
                                                { errors.password && <p className="error">{ errors.password.message }</p> }
                                                
                                                <label className="label">Confirm Password</label>
                                                <input type="password"
                                                       placeholder="Confirm Password"
                                                       className="field"
                                                       value={customer.confirm_password}
                                                       onChange={this.handleChange}
                                                       name="confirm_password" 
                                                    />
                                                { passwordError && <p className="error">{ passwordError }</p> }

                                                <button className="button" disabled={isSubmitting}>
                                                { isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Update' }</button>
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

export default connect(mapStateToProps)(MyProfile)