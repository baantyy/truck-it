import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import AuthHeader from "../../common/AuthHeader"

class Add extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pickup: "",
            dropoff: "",
            pickup_date: new Date(),
            volume: null,
            truck: null,

            distance: "",
            duration: "",
            amount: "",

            isSubmitting: false,
            errors: {},
            volumes: [
                { label: "Few Items", value: 5 },
                { label: "1 BHK", value: 10 },
                { label: "2 BHK", value: 20 },
                { label: "3 BHK", value: 30 },
                { label: "4 BHK", value: 40 },
                { label: "Custom", value: 50 }
            ],
            trucks: [],
            isLoaded: false
        }
    }

    componentDidMount(){
        document.title = 'Schedule Booking'
        axios.get("/api/users/vehicles")
            .then(res => {
                this.setState(() => ({
                    trucks: res.data.map(data => ({label: data.name, value: data._id})),
                    isLoaded: true
                }))
            })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        
        this.setState(() => ({
            isSubmitting: true
        }))

        const { user, history } = this.props
        const { pickup, dropoff, pickup_date, volume, truck } = this.state
        const formdata = {
            pickup, dropoff, pickup_date, volume: volume.label, truck: truck.value
        }

        axios.post(`/api/users/bookings/`,formdata,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    isSubmitting: false
                }))
                if(res.data.success){
                    this.estimatedCost(pickup, dropoff, res.data.success._id)
                }else{
                    this.setState(() => ({
                        isSubmitting: false,
                        errors: res.data.errors
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            })        
    }

    estimatedCost = (pickup, dropoff, id) => {

    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    handleVolumeChange = (option) => {
        this.setState(() => ({
            volume: option
        }))
    }

    handleTruckChange = (option) => {
        this.setState(() => ({
            truck: option
        }))
    }

    handleDate = (date) => {
        this.setState(() => ({
            pickup_date: date
        }))
    }

    render(){    
        const { pickup, dropoff, pickup_date, volumes, trucks, errors, isSubmitting, isLoaded } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <ul className="topLinks">
                                <li><Link className="edit" to="/customer">Back</Link></li>
                            </ul>
                            <div className="row">
                                <div className="col-lg-6">
                                    <h1>Schedule Booking</h1>
                                    { isLoaded &&
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <label className="label">Pickup Address</label>
                                        <input type="text"
                                               placeholder="Pickup Address"
                                               className="field"
                                               value={pickup}
                                               onChange={this.handleChange}
                                               name="pickup" 
                                            />
                                        { errors.pickup && <p className="error">{ errors.pickup.message }</p> }

                                        <label className="label">Dropoff Address</label>
                                        <input type="text"
                                               placeholder="Dropoff Address"
                                               className="field"
                                               value={dropoff}
                                               onChange={this.handleChange}
                                               name="dropoff" 
                                            />
                                        { errors.dropoff && <p className="error">{ errors.dropoff.message }</p> }

                                        <label className="label">Pickup Date</label>
                                        <DatePicker selected={pickup_date}
                                                    onChange={this.handleDate}
                                                    dateFormat="d/M/Y"
                                                />                                        
                                        { errors.pickup_date && <p className="error">{ errors.pickup_date.message }</p> }

                                        <label className="label">Choose Volume</label>
                                        <Select options={volumes} 
                                                onChange={this.handleVolumeChange} 
                                            />                                        
                                        { errors.volume && <p className="error">{ errors.volume.message }</p> }

                                        <label className="label">Choose Truck</label>
                                        <Select options={trucks} 
                                                onChange={this.handleTruckChange} 
                                            />                                        
                                        { errors.truck && <p className="error">{ errors.truck.message }</p> }
                                        
                                        <button className="button" disabled={isSubmitting}>
                                        { isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Submit' }</button>
                                    </form>
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

export default connect(mapStateToProps)(Add)