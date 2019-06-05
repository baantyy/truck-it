import React from 'react'
import axios from 'axios'

class Contact extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: "",
            email: "",
            mobile: "",
            message: "",
            status: false,
            isSubmitting: false,
            errors: {}
        }
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value,
            status: false
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()    
        this.setState(() => ({
            isSubmitting: true
        }))    
        const formData = {
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            message: this.state.message
        }
        axios.post("/api/users/contact",formData)
            .then(res => {
                if(res.data.success){
                    this.setState(() => ({
                        isSubmitting: false,
                        status: true,
                        name: "",
                        email: "",
                        mobile: "",
                        message: "",
                        errors: {}
                    }))
                }else{
                    this.setState(() => ({
                        isSubmitting: false,
                        status: false,
                        errors: res.data.errors
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render(){
        const { name, email, mobile, message, isSubmitting, status, errors } = this.state
        return (
            <div className="contact" id="contact">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Get in touch with us</h2>
                            <form className="form-row" onSubmit={this.handleSubmit}>
                                <div className="col-12">
                                    <input type="text"
                                           placeholder="Name"
                                           name="name"
                                           value={name}
                                           onChange={this.handleChange}
                                        />
                                    { errors.name && <p className="error">{errors.name.message}</p> }
                                </div>
                                <div className="col-md-6">
                                    <input type="email" 
                                           placeholder="Email Id"
                                           name="email"
                                           value={email}
                                           onChange={this.handleChange}
                                        />
                                    { errors.email && <p className="error">{errors.email.message}</p> }
                                </div>
                                <div className="col-md-6">
                                    <input type="text" 
                                           placeholder="Mobile" 
                                           name="mobile"
                                           value={mobile}
                                           onChange={this.handleChange}
                                        />
                                    { errors.mobile && <p className="error">{errors.mobile.message}</p> }
                                </div>
                                <div className="col-12">
                                    <textarea placeholder="Message" 
                                              rows="4"
                                              name="message"
                                              value={message}
                                              onChange={this.handleChange}
                                            ></textarea>
                                    { errors.message && <p className="error">{errors.message.message}</p> }
                                </div>
                                <div className="col-12">
                                    <button disabled={isSubmitting}> {isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : "Send" } </button>
                                </div>
                                { status && <p className="success">Message sent successfully</p> }
                            </form>
                        </div>
                        <div className="col-md-6">
                            <div className="map">
                                <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6535604984083!2d77.58323301464475!3d12.929973890883206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15a4603b2603%3A0x91b59697af5877bb!2sDCT+Academy+-+Full+Stack+Web+Developer+Course+Training+Institute+in+Bangalore!5e0!3m2!1sen!2sin!4v1559064176757!5m2!1sen!2sin" frameBorder="0" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>                
        )
    }
}

export default Contact