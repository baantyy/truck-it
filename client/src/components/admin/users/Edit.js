import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FancyBox from 'react-fancybox'

import AuthHeader from "../../common/AuthHeader"

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: {
                new_password: "",
                confirm_password: ""
            },
            personalDetails: false,
            personalErrors: {
                fullname: "",
                email: "",
                role: "",
                allowAccess: "",
                mobile: "",
                password: ""
            },
            personalSubmitting: false,
            passwordError: "",

            business: {},
            businessDetails: false,
            businessErrors: {},
            businessSubmitting: false,

            role: ""
        }
    }

    componentDidMount(){
        const { user, match } = this.props
        const id = match.params.id
        axios.get(`/api/admin/users/${id}`, {
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState((prevState) => ({
                    user: {...prevState.user, ...res.data},
                    personalDetails: true,
                    role: res.data.role
                }))
                res.data.role === "vendor" && this.getVendorDetails()
                document.title = res.data.fullname 
            })
    }

    getVendorDetails = () => {
        const { user, match } = this.props
        const id = match.params.id
        axios.get(`/api/admin/vendors/${id}`,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    business: {
                        isVerified: res.data.isVerified ? true : false,
                        address: res.data.address ? res.data.address.full : "",
                        pincode: res.data.address ? res.data.address.pincode : "",
                        bank_account_number: res.data.payment ? res.data.payment.bank_account ? res.data.payment.bank_account.number : "" : "",
                        bank_account_ifsc: res.data.payment ? res.data.payment.bank_account ? res.data.payment.bank_account.ifsc : "" : "",
                        pan: res.data.document ? res.data.document.pan : "",
                        aadhar: res.data.document ? res.data.document.aadhar : "",
                        _pan: res.data.document ? res.data.document.pan : "",
                        _aadhar: res.data.document ? res.data.document.aadhar : ""
                    },
                    businessDetails: true
                }))
            })
    }

    handlePersonalChange = (e) => {
        e.persist()
        const value = e.target.value
        this.setState((prevState) => ({
            user: {...prevState.user, ...{[e.target.name]: value}}
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
        const { fullname, email, new_password, confirm_password, role, allowAccess, mobile } = this.state.user
        const { user, match, history } = this.props
        const id = match.params.id
        if(new_password === confirm_password){
            this.setState(() => ({
                passwordError: "",
                personalSubmitting: true
            }))
            const formdata = {
                fullname,
                email,
                password: new_password,
                role,
                allowAccess,
                mobile
            }
            axios.put(`/api/admin/users/${id}`,formdata,{
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    this.setState(() => ({
                        personalSubmitting: false
                    }))
                    if(res.data.success){
                        history.push(`/admin/users/${id}`)
                    }else{
                        this.setState(() => ({
                            personalErrors: res.data.errors
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
        const { address, pincode, bank_account_number, bank_account_ifsc, pan, aadhar, isVerified } = this.state.business
        const { user, match, history } = this.props
        const id = match.params.id
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
        formdata.append('isVerified', isVerified)
        
        axios.put(`/api/admin/vendors/${id}`,formdata,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    businessSubmitting: false
                }))
                if(res.data.success){
                    history.push(`/admin/users/${id}`)
                }else{
                    this.setState(() => ({
                        businessErrors: res.data.errors
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
        const id = this.props.match.params.id
        const { user, business, personalDetails, businessDetails, personalErrors, businessErrors, passwordError, personalSubmitting, businessSubmitting, role } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link to={`/admin/users/${id}`}>View</Link></li>
                                <li><Link className="edit" to="/admin/users">Back</Link></li>
                            </ul>
                            <div className="row">
                                <div className={ "col-lg-6" + (role !== "vendor" ? " offset-lg-3" : "") }>
                                    { personalDetails &&
                                        <React.Fragment>
                                            <h1>Edit Personal Details</h1>
                                            <form className="form" onSubmit={this.handlePersonalSubmit}>
                                                <label className="label">Fullname</label>
                                                <input type="text"
                                                       placeholder="Fullname"
                                                       className="field"
                                                       value={user.fullname}
                                                       onChange={this.handlePersonalChange}
                                                       name="fullname" 
                                                    />
                                                { personalErrors.fullname && <p className="error">{ personalErrors.fullname.message }</p> }

                                                <label className="label">Email Id</label>
                                                <input type="email"
                                                       placeholder="Email Id"
                                                       className="field"
                                                       value={user.email}
                                                       onChange={this.handlePersonalChange}
                                                       name="email" 
                                                    />
                                                { personalErrors.email && <p className="error">{ personalErrors.email.message }</p> }
                                                
                                                <label className="label">Mobile</label>
                                                <input type="text"
                                                       placeholder="Mobile"
                                                       className="field"
                                                       value={user.mobile}
                                                       onChange={this.handlePersonalChange}
                                                       name="mobile" 
                                                    />
                                                { personalErrors.mobile && <p className="error">{ personalErrors.mobile.message }</p> }

                                                <label className="label">Role</label>
                                                <select className="field" 
                                                        value={user.role}
                                                        onChange={this.handlePersonalChange}
                                                        name="role"
                                                    >
                                                    {['Customer', 'Vendor', 'Admin'].map((role,index) => {
                                                        return (
                                                            <option key={index} value={ role.toLowerCase() }>{ role }</option>
                                                        )
                                                    })}
                                                </select>
                                                { personalErrors.role && <p className="error">{ personalErrors.role.message }</p> }

                                                <label className="label">Access</label>
                                                <select className="field" 
                                                        value={user.allowAccess}
                                                        onChange={this.handlePersonalChange}
                                                        name="allowAccess"
                                                    >                                                    
                                                    <option value="true">Allowed</option>
                                                    <option value="false">Not Allowed</option>
                                                </select>
                                                { personalErrors.allowAccess && <p className="error">{ personalErrors.allowAccess.message }</p> }

                                                <label className="label">New Password</label>
                                                <input type="password"
                                                       placeholder="New Password"
                                                       className="field"
                                                       value={user.new_password}
                                                       onChange={this.handlePersonalChange}
                                                       name="new_password" 
                                                    />
                                                { personalErrors.password && <p className="error">{ personalErrors.password.message }</p> }
                                                
                                                <label className="label">Confirm Password</label>
                                                <input type="password"
                                                       placeholder="Confirm Password"
                                                       className="field"
                                                       value={user.confirm_password}
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
                                                <label className="label">Verified</label>
                                                <select className="field" 
                                                        value={business.isVerified}
                                                        onChange={this.handleBusinessChange}
                                                        name="isVerified"
                                                    >                                                    
                                                    <option value="true">Verified</option>
                                                    <option value="false">Not Verified</option>
                                                </select>
                                                { businessErrors.isVerified && <p className="error">{ businessErrors.isVerified.message }</p> }

                                                <label className="label">Address</label>
                                                <textarea placeholder="Address" 
                                                          className="field"
                                                          value={business.address}
                                                          onChange={this.handleBusinessChange}
                                                          name="address" 
                                                          rows="5"
                                                    ></textarea>
                                                { businessErrors['address.full'] && <p className="error">{ businessErrors['address.full'].message }</p> }

                                                <label className="label">Pincode</label>
                                                <input type="text"
                                                       placeholder="Pincode"
                                                       className="field"
                                                       value={business.pincode}
                                                       onChange={this.handleBusinessChange}
                                                       name="pincode" 
                                                    />
                                                { businessErrors['address.pincode'] && <p className="error">{ businessErrors['address.pincode'].message }</p> }

                                                <label className="label">Bank Account</label>
                                                <input type="text"
                                                       placeholder="Number"
                                                       className="field"
                                                       value={business.bank_account_number}
                                                       onChange={this.handleBusinessChange}
                                                       name="bank_account_number" 
                                                    />
                                                { businessErrors['payment.bank_account.number'] && <p className="error">{ businessErrors['payment.bank_account.number'].message }</p> }
                                                
                                                <label className="label">Bank IFSC</label>
                                                <input type="text"
                                                       placeholder="IFSC"
                                                       className="field"
                                                       value={business.bank_account_ifsc}
                                                       onChange={this.handleBusinessChange}
                                                       name="bank_account_ifsc" 
                                                    />
                                                { businessErrors['payment.bank_account.ifsc'] && <p className="error">{ businessErrors['payment.bank_account.ifsc'].message }</p> }

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
                                                            <FancyBox thumbnail={business._pan}
                                                                    image={business._pan} 
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
                                                            <FancyBox thumbnail={business._aadhar} 
                                                                image={business._aadhar} 
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