import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FancyBox from 'react-fancybox'

import AuthHeader from "../../common/AuthHeader"
import { fileUrl } from "../../../config/config"

class ViewOne extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: {},
            business: {},
            personalDetails: false,
            businessDetails: false,
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
                this.setState(() => ({
                    user: res.data,
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
                    business: res.data,
                    businessDetails: true
                }))
            })
    }

    render(){
        const { user, business, personalDetails, businessDetails, role } = this.state
        const id = this.props.match.params.id
        return(
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link to={`/admin/users/edit/${id}`}>Edit</Link></li>
                                <li><Link className="edit" to="/admin/users">Back</Link></li>
                            </ul>
                            <div className="row">
                                <div className={ "col-lg-6" + (role !== "vendor" ? " offset-lg-3" : "") }>
                                    { personalDetails &&
                                        <React.Fragment>
                                            <h1>Personal Details</h1>
                                            <div className="viewBox">
                                                <ul>
                                                    <li><b>Fullname</b> : { user.fullname }</li>
                                                    <li><b>Email Id</b> : { user.email }</li>
                                                    <li><b>Mobile</b> : { user.mobile }</li>
                                                    <li className="cap"><b>Role</b> : { user.role }</li>
                                                    <li><b>Access</b> : { user.allowAccess ? <span className="text-success">Allowed</span> : <span className="text-danger">Not Allowed</span> }</li>
                                                </ul>
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>
                                <div className="col-lg-6">
                                    { businessDetails &&
                                        <React.Fragment>
                                            <h1>Business Details</h1>
                                            <div className="viewBox">
                                                <ul>
                                                    <li>
                                                        <b>Verified</b> :&nbsp; 
                                                        { business.isVerified ? 
                                                        <span className="text-success">Verified</span> : 
                                                        <span className="text-danger">Not Verified</span> }
                                                    </li>

                                                    <li>
                                                        <b>Address</b> :&nbsp;
                                                        { business.address && business.address.full }
                                                    </li>

                                                    <li>
                                                        <b>Pincode</b> :&nbsp;
                                                        { business.address && business.address.pincode }
                                                    </li>

                                                    <li>
                                                        <b>Bank Account</b> :&nbsp;
                                                        { business.payment && business.payment.bank_account && business.payment.bank_account.number }
                                                    </li>

                                                    <li>
                                                        <b>IFSC</b> :&nbsp;
                                                        { business.payment && business.payment.bank_account && business.payment.bank_account.ifsc }
                                                    </li>

                                                    <li className="img">
                                                        <b>PAN</b> :&nbsp;
                                                        { business.document && business.document.pan && 
                                                        <FancyBox thumbnail={fileUrl + business.document.pan}
                                                                  image={fileUrl + business.document.pan}
                                                        />}
                                                    </li>

                                                    <li>
                                                        <b>Aadhar</b> :&nbsp;
                                                        { business.document && business.document.aadhar && 
                                                        <FancyBox thumbnail={fileUrl + business.document.aadhar} 
                                                            image={fileUrl + business.document.aadhar} 
                                                        /> }
                                                    </li>
                                                </ul>
                                            </div>
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

export default connect(mapStateToProps)(ViewOne)