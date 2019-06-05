import React from 'react'
import { Link } from 'react-router-dom'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const Register = (props) => {

    const { values, errors, touched, isSubmitting, status } = props
    document.title = "Register"

    return (
        <div className="wrapper">
            <div className="loginPage">
                <div className="loginBox">
                    <div className="logo">
                        <Link to="/"><i className="fas fa-angle-left"></i></Link>
                    </div>
                    <div className="text half">

                    </div>
                    <div className="action half">
                        <div>
                            <div>
                                <h1>Create a New Account</h1>
                                <Form>
                                    <Field className="field" 
                                        type="text" 
                                        name="fullname"
                                        placeholder="Fullname" 
                                        />
                                    { touched.fullname && errors.fullname && <p className="error">{errors.fullname}</p> }
                                    <div className="form-row">
                                        <div className="col-md-6">
                                            <Field className="field" 
                                                type="email" 
                                                name="email"
                                                placeholder="Email Id"
                                                />
                                            { touched.email && errors.email && <p className="error">{errors.email}</p> }
                                        </div>
                                        <div className="col-md-6">
                                            <Field className="field" 
                                                type="text" 
                                                name="mobile"
                                                placeholder="Mobile" 
                                                />
                                            { touched.mobile && errors.mobile && <p className="error">{errors.mobile}</p> }
                                        </div>
                                        <div className="col-md-6">
                                            <Field className="field" 
                                                type="password" 
                                                name="password"
                                                placeholder="New Password" 
                                                />
                                            { touched.password && errors.password && <p className="error">{errors.password}</p> }
                                        </div>
                                        <div className="col-md-6">
                                            <Field className="field" 
                                                type="password" 
                                                name="confirm_password"
                                                placeholder="Confirm Password"
                                                />
                                            { touched.confirm_password && errors.confirm_password && <p className="error">{errors.confirm_password}</p> }
                                        </div>
                                    </div>                                        
                                    <div className="roleOptions">
                                        {['customer','vendor'].map((item, index) => {
                                            return (
                                                <div className="custom-control custom-radio" key={index}>
                                                    <Field type="radio" 
                                                        id={`choose-item-${index}`} 
                                                        name="role" 
                                                        className="custom-control-input"
                                                        value={item}
                                                        checked={item === values.role}
                                                        />
                                                    <label className="custom-control-label" 
                                                        htmlFor={`choose-item-${index}`}>
                                                        {item}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    { touched.role && errors.role && <p className="error">{errors.role}</p> }

                                    <button type="submit" 
                                            disabled={isSubmitting} >
                                    {isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Register' }</button>
                                </Form>

                                { status && <p className="success">{status.success}</p> }

                                <div className="extraLink">
                                    Already have an account ? <Link to="/login">Sign In</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const formikRegister = withFormik({
    mapPropsToValues(){
        return {
            fullname: "",
            email: "",
            mobile: "",
            password: "",
            confirm_password: "",
            role: ""
        }
    },

    validationSchema: Yup.object().shape({
        fullname        : Yup.string()
                              .min(4, "Fullname is short")
                              .required("Fullname is required"),
        email           : Yup.string()
                             .email("Email is not valid")
                             .required("Email is required"),
        mobile          : Yup.number()
                             .typeError("Mobile number is invalid")
                             .min(1000000000, "Mobile number is invalid")
                             .max(9999999999, "Mobile number is invalid")
                             .required("Mobile number is required"),
        password        : Yup.string()
                             .min(6, "Password is short")
                             .required("Password is required"),
        confirm_password: Yup.string()
                             .oneOf([Yup.ref('password'), null],"Passwords don't match")
                             .required("Confirm password is required"),
        role            : Yup.string()
                             .required("Role is required")
    }),

    handleSubmit(values, { setErrors, resetForm, setSubmitting, setStatus }){
        setStatus({success: ''})

        const vendorRegister = (user) => {
            axios.post("/api/vendors/register",{user})
                .then(res => {
                    resetForm()
                    setStatus({success: 'Successfully Registered'})
                })
        }

        axios.post("/api/users/register",values)
            .then(res => {
                setSubmitting(false)
                if(res.data.errors){
                    const errors = res.data.errors
                    setErrors({
                        fullname: errors.fullname ? errors.fullname.message : "",
                        email: errors.email ? errors.email.message : "",
                        mobile: errors.mobile ? errors.mobile.message : "",
                        password: errors.password ? errors.password.message : "",
                        role: errors.role ? errors.role.message : ""
                    })
                }else{
                    if(res.data.role === "vendor"){
                        vendorRegister(res.data._id)
                    }else{                        
                        resetForm()
                        setStatus({success: 'Successfully Registered'})
                    }
                }
            })
    }
})(Register)

export default formikRegister