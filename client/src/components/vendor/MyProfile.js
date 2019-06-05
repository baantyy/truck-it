import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import FancyBox from 'react-fancybox'

import AuthHeader from "../common/AuthHeader"
import { updateUser } from "../../actions/User"
import { fileUrl } from "../../config/config"

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            vendor: {
                new_password: "",
                confirm_password: ""
            },
            personalDetails: false,
            personalErrors: {
                fullname: "",
                email: "",
                mobile: "",
                password: ""
            },
            personalSubmitting: false,
            passwordError: "",
            personalSuccess: "",

            business: {},
            businessDetails: false,
            businessErrors: {},
            businessSubmitting: false,
            businessSuccess: ""
        }
    }

    componentDidMount(){
        const { user } = this.props
        document.title = user.fullname 
        this.setState((prevState) => ({
            vendor: {...prevState.vendor, ...user},
            personalDetails: true
        }))

        axios.get("/api/vendors/my_profile",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                if(res.data.success){
                    const vendor = res.data.success
                    this.setState(() => ({
                        business: {
                            address: (vendor.address && vendor.address.full) ? vendor.address.full : "",
                            pincode: (vendor.address && vendor.address.pincode) ? vendor.address.pincode : "",
                            bank_account_number: (vendor.payment && vendor.payment.bank_account && vendor.payment.bank_account.number) ? vendor.payment.bank_account.number : "",
                            bank_account_ifsc: (vendor.payment && vendor.payment.bank_account && vendor.payment.bank_account.ifsc) ? vendor.payment.bank_account.ifsc : "",
                            pan: (vendor.document && vendor.document.pan) ? vendor.document.pan : "",
                            aadhar: (vendor.document && vendor.document.aadhar) ? vendor.document.aadhar : "",
                            _pan: (vendor.document && vendor.document.pan) ? vendor.document.pan : "",
                            _aadhar: (vendor.document && vendor.document.aadhar) ? vendor.document.aadhar : ""
                        },
                        businessDetails: true
                    }))
                }
            })
    }

    handlePersonalChange = (e) => {
        e.persist()
        const value = e.target.value
        this.setState((prevState) => ({
            vendor: {...prevState.vendor, ...{[e.target.name]: value}}
        }))
    }

    handleBusinessChange = (e) => {
        e.persist()
        const value = e.target.value
        this.setState((prevState) => ({
            business: {...prevState.business, ...{[e.target.name]: value}}
        }))
    }

    handlePersonalSubmit = (e) => {
        e.preventDefault()
        const { fullname, email, new_password, confirm_password, mobile } = this.state.vendor
        const { user } = this.props
        if(new_password === confirm_password){
            this.setState(() => ({
                passwordError: "",
                personalSubmitting: true
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
                    this.setState(() => ({
                        personalSubmitting: false
                    }))
                    if(res.data.success){
                        this.setState((prevState) => ({
                            personalSuccess: "Successfully Updated",
                            personalErrors: {},
                            personalSubmitting: false,
                            vendor: {...prevState.vendor, ...{new_password: "", confirm_password: ""}}
                        }))
                        delete formdata.password
                        this.props.dispatch(updateUser(formdata))
                    }else{
                        this.setState(() => ({
                            personalSuccess: "",
                            personalErrors: res.data.errors,
                            personalSubmitting: false
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

    handleBusinessSubmit = (e) => {
        e.preventDefault()
        const { address, pincode, bank_account_number, bank_account_ifsc, pan, aadhar } = this.state.business
        const { user } = this.props
        this.setState(() => ({
            businessSubmitting: true
        }))
        
        const formdata = new FormData()
        formdata.append('address', address)
        formdata.append('pincode', pincode)
        formdata.append('bank_account_number', bank_account_number)
        formdata.append('bank_account_ifsc', bank_account_ifsc)
        formdata.append('pan', pan)
        formdata.append('aadhar', aadhar)
        
        axios.put(`/api/vendors/update_profile`,formdata,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    businessSubmitting: false
                }))
                if(res.data.success){
                    this.setState((prevState) => ({
                        business: {...prevState.business, ...{_pan: res.data.success.document.pan, _aadhar: res.data.success.document.aadhar}},
                        businessSuccess: "Successfully Updated",
                        businessErrors: {},
                        businessSubmitting: false
                    }))
                }else{
                    this.setState(() => ({
                        businessSuccess: "",
                        businessErrors: res.data.errors,
                        businessSubmitting: false
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    handleFileChange = (e) => {
        e.persist()
        this.setState((prevState) => ({
            business: {...prevState.business, ...{[e.target.name]: e.target.files[0]}}
        }))
    }

    render(){
        const { vendor, business, personalDetails, businessDetails, personalErrors, businessErrors, passwordError, personalSubmitting, businessSubmitting, personalSuccess, businessSuccess } = this.state
        console.log(businessErrors)
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    { personalDetails &&
                                        <React.Fragment>
                                            <h1>Edit Personal Details</h1>
                                            <form className="form" onSubmit={this.handlePersonalSubmit}>
                                                { personalSuccess && <p className="success">{ personalSuccess }</p> }

                                                <label className="label">Fullname</label>
                                                <input type="text"
                                                       placeholder="Fullname"
                                                       className="field"
                                                       value={vendor.fullname}
                                                       onChange={this.handlePersonalChange}
                                                       name="fullname" 
                                                    />
                                                { personalErrors.fullname && <p className="error">{ personalErrors.fullname.message }</p> }

                                                <label className="label">Email Id</label>
                                                <input type="email"
                                                       placeholder="Email Id"
                                                       className="field"
                                                       value={vendor.email}
                                                       onChange={this.handlePersonalChange}
                                                       name="email" 
                                                    />
                                                { personalErrors.email && <p className="error">{ personalErrors.email.message }</p> }
                                                
                                                <label className="label">Mobile</label>
                                                <input type="text"
                                                       placeholder="Mobile"
                                                       className="field"
                                                       value={vendor.mobile}
                                                       onChange={this.handlePersonalChange}
                                                       name="mobile" 
                                                    />
                                                { personalErrors.mobile && <p className="error">{ personalErrors.mobile.message }</p> }

                                                <label className="label">New Password</label>
                                                <input type="password"
                                                       placeholder="New Password"
                                                       className="field"
                                                       value={vendor.new_password}
                                                       onChange={this.handlePersonalChange}
                                                       name="new_password" 
                                                    />
                                                { personalErrors.password && <p className="error">{ personalErrors.password.message }</p> }
                                                
                                                <label className="label">Confirm Password</label>
                                                <input type="password"
                                                       placeholder="Confirm Password"
                                                       className="field"
                                                       value={vendor.confirm_password}
                                                       onChange={this.handlePersonalChange}
                                                       name="confirm_password" 
                                                    />
                                                { passwordError && <p className="error">{ passwordError }</p> }

                                                <button className="button" disabled={personalSubmitting}>
                                                { personalSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Update' }</button>
                                            </form>
                                        </React.Fragment>
                                    }
                                </div>
                                <div className="col-lg-6">
                                    { businessDetails &&
                                        <React.Fragment>
                                            <h1>Edit Business Details</h1>
                                            <form className="form" onSubmit={this.handleBusinessSubmit}>
                                                { businessSuccess && <p className="success">{ businessSuccess }</p> }

                                                <label className="label">Address</label>
                                                <textarea placeholder="Address" 
                                                          className="field"
                                                          value={business.address}
                                                          onChange={this.handleBusinessChange}
                                                          name="address" 
                                                          rows="5"
                                                    ></textarea>
                                                { businessErrors['address.full'] && <p className="error">{businessErrors['address.full'].message}</p> }
                                                
                                                <label className="label">Pincode</label>
                                                <input type="text"
                                                       placeholder="Pincode"
                                                       className="field"
                                                       value={business.pincode}
                                                       onChange={this.handleBusinessChange}
                                                       name="pincode" 
                                                    />
                                                { businessErrors['address.pincode'] && <p className="error">{businessErrors['address.pincode'].message}</p> }

                                                <label className="label">Bank Account</label>
                                                <input type="text"
                                                       placeholder="Number"
                                                       className="field"
                                                       value={business.bank_account_number}
                                                       onChange={this.handleBusinessChange}
                                                       name="bank_account_number" 
                                                    />
                                                { businessErrors['payment.bank_account.number'] && <p className="error">{businessErrors['payment.bank_account.number'].message}</p> }
                                                
                                                <label className="label">Bank IFSC</label>
                                                <input type="text"
                                                       placeholder="IFSC"
                                                       className="field"
                                                       value={business.bank_account_ifsc}
                                                       onChange={this.handleBusinessChange}
                                                       name="bank_account_ifsc" 
                                                    />
                                                { businessErrors['payment.bank_account.ifsc'] && <p className="error">{businessErrors['payment.bank_account.ifsc'].message}</p> }
                                                
                                                <div className="row">
                                                    <div className="col-md-7">
                                                        <label className="label">PAN Image</label>
                                                        <input type="file"
                                                               className="field"
                                                               onChange={this.handleFileChange}
                                                               name="pan" 
                                                            />
                                                    </div>
                                                    <div className="col-md-5">
                                                        { business._pan && 
                                                            <FancyBox thumbnail={fileUrl + business._pan}
                                                                    image={fileUrl + business._pan} 
                                                                />
                                                        }
                                                    </div>
                                                    <div className="col-md-7">
                                                        <label className="label">Aadhar Image</label>
                                                        <input type="file"
                                                               className="field"
                                                               onChange={this.handleFileChange}
                                                               name="aadhar" 
                                                            />
                                                    </div>
                                                    <div className="col-md-5">
                                                        { business._aadhar && 
                                                            <FancyBox thumbnail={fileUrl + business._aadhar} 
                                                                image={fileUrl + business._aadhar} 
                                                            />
                                                        }
                                                    </div>
                                                </div> 

                                                <button className="button" disabled={businessSubmitting}>
                                                { businessSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Update' }</button>
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