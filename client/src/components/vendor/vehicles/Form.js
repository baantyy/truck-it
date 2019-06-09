import React from 'react'
import axios from 'axios'
import Select from 'react-select'

class Form extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            vehicle: props._vehicle ? {label: props._vehicle.vehicle.name, value: props._vehicle.vehicle._id} : null,
            number_plate: props._vehicle ? props._vehicle.number_plate : "",
            pricing_intercity_km: props._vehicle ? props._vehicle.pricing.inter_city.ratePerKm : "",
            pricing_intercity_min: props._vehicle ? props._vehicle.pricing.inter_city.ratePerMin : "",
            pricing_intracity_km: props._vehicle ? props._vehicle.pricing.intra_city.ratePerKm : "",
            pricing_intracity_min: props._vehicle ? props._vehicle.pricing.intra_city.ratePerMin : "",
            helper_rate: props._vehicle ? props._vehicle.helper_rate : "",
            vehicleOptions: [],
            vehiclesLoaded: false,
            allVehicles: [],
            showVehicle: props._vehicle ? {...props._vehicle.vehicle, ...{status: true}} : {status: false}
        }
    }

    componentDidMount(){
        axios.get("/api/vendors/vehicles/all",{
                headers: { 'x-auth': this.props.user.token }
            })
            .then(res => {
                this.setState(() => ({ 
                    vehicleOptions: res.data.map(vehicle => ({value: vehicle._id, label: vehicle.name})),
                    allVehicles: res.data,
                    vehiclesLoaded: true
                }))
            })   
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { vehicle, number_plate, pricing_intercity_km, pricing_intercity_min, pricing_intracity_km, pricing_intracity_min, helper_rate } = this.state
        const formdata = {
            vehicle: vehicle ? vehicle.value : null,
            number_plate: number_plate ? number_plate : "",
            pricing_intercity_km: pricing_intercity_km ? pricing_intercity_km : "",
            pricing_intercity_min: pricing_intercity_min ? pricing_intercity_min : "",
            pricing_intracity_km: pricing_intracity_km ? pricing_intracity_km : "",
            pricing_intracity_min: pricing_intracity_min ? pricing_intracity_min : "",
            helper_rate: helper_rate ? helper_rate : "",
        }
        this.props.handleSubmit(formdata)
    }

    handleVehicleSelect = (option) => {
        this.setState((prevState) => ({
            vehicle: option,
            showVehicle: {...prevState.showVehicle, ...prevState.allVehicles.find(vehicle => vehicle._id === option.value), ...{status: true}}
        }))
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    render(){
        const { isSubmitting, errors, page } = this.props
        const { vehiclesLoaded, vehicle, number_plate, vehicleOptions, pricing_intercity_km, pricing_intercity_min, pricing_intracity_km, pricing_intracity_min, helper_rate, showVehicle } = this.state
        return (
            <div className="row">
                <div className="col-lg-6">
                    { vehiclesLoaded &&
                        <form className="form" onSubmit={this.handleSubmit}>

                            <label className="label">Vehicle</label>
                            <Select options={vehicleOptions} 
                                    value={vehicle} 
                                    onChange={this.handleVehicleSelect} 
                                />
                            { (errors.vehicle && page === "add") && <p className="error">{errors.vehicle.message}</p> }

                            { (errors['vehicles.0.vehicle'] && page === "edit") && <p className="error">{errors['vehicles.0.vehicle'].message}</p> }

                            <label className="label">Number Plate</label>
                            <input type="text"
                                    placeholder="Number Plate"
                                    className="field"
                                    value={number_plate}
                                    onChange={this.handleChange}
                                    name="number_plate" 
                                />
                            { (errors.number_plate && page === "add") && <p className="error">{errors.number_plate.message}</p> }
                            
                            { (errors['vehicles.0.number_plate'] && page === "edit") && <p className="error">{errors['vehicles.0.number_plate'].message}</p> }

                            <div className="row">
                                <div className="col-lg-6">
                                    <label className="label">Intercity Pricing (Per KM)</label>
                                    <input type="text"
                                            placeholder="Rs."
                                            className="field"
                                            value={pricing_intercity_km}
                                            onChange={this.handleChange}
                                            name="pricing_intercity_km" 
                                        /> 
                                    { (errors['pricing.inter_city.ratePerKm'] && page === "add") && <p className="error">{errors['pricing.inter_city.ratePerKm'].message}</p> }
                            
                                    { (errors['vehicles.0.pricing.inter_city.ratePerKm'] && page === "edit") && <p className="error">{errors['vehicles.0.pricing.inter_city.ratePerKm'].message}</p> }

                                </div>
                                <div className="col-lg-6">
                                    <label className="label">Intercity Pricing (Per Min.)</label>
                                    <input type="text"
                                            placeholder="Rs."
                                            className="field"
                                            value={pricing_intercity_min}
                                            onChange={this.handleChange}
                                            name="pricing_intercity_min" 
                                        /> 

                                    { (errors['pricing.inter_city.ratePerMin'] && page === "add") && <p className="error">{errors['pricing.inter_city.ratePerMin'].message}</p> }
                            
                                    { (errors['vehicles.0.pricing.inter_city.ratePerMin'] && page === "edit") && <p className="error">{errors['vehicles.0.pricing.inter_city.ratePerMin'].message}</p> }

                                </div>
                                <div className="col-lg-6">
                                    <label className="label">Intracity Pricing (Per KM)</label>
                                    <input type="text"
                                            placeholder="Rs."
                                            className="field"
                                            value={pricing_intracity_km}
                                            onChange={this.handleChange}
                                            name="pricing_intracity_km" 
                                        /> 

                                    { (errors['pricing.intra_city.ratePerKm'] && page === "add") && <p className="error">{errors['pricing.intra_city.ratePerKm'].message}</p> }
                            
                                    { (errors['vehicles.0.pricing.intra_city.ratePerKm'] && page === "edit") && <p className="error">{errors['vehicles.0.pricing.intra_city.ratePerKm'].message}</p> }

                                </div>
                                <div className="col-lg-6">
                                    <label className="label">Intracity Pricing (Per Min.)</label>
                                    <input type="text"
                                            placeholder="Rs."
                                            className="field"
                                            value={pricing_intracity_min}
                                            onChange={this.handleChange}
                                            name="pricing_intracity_min" 
                                        /> 

                                    { (errors['pricing.intra_city.ratePerMin'] && page === "add") && <p className="error">{errors['pricing.intra_city.ratePerMin'].message}</p> }
                            
                                    { (errors['vehicles.0.pricing.intra_city.ratePerMin'] && page === "edit") && <p className="error">{errors['vehicles.0.pricing.intra_city.ratePerMin'].message}</p> }

                                </div>
                            </div>

                            <label className="label">Helper Rate</label>
                            <input type="text"
                                    placeholder="Rs."
                                    className="field"
                                    value={helper_rate}
                                    onChange={this.handleChange}
                                    name="helper_rate" 
                                />
                            { (errors.helper_rate && page === "add") && <p className="error">{errors.helper_rate.message}</p> }

                            { (errors['vehicles.0.helper_rate'] && page === "edit") && <p className="error">{errors['vehicles.0.helper_rate'].message}</p> }

                            <button className="button" disabled={isSubmitting}>
                            { isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Submit' }</button>
                        </form>
                    }
                </div>
                <div className="col-lg-6">
                    { showVehicle.status && 
                        <div className="viewBox">
                            <ul>
                                <li><b>Name</b> : { showVehicle.name }</li>
                                <li><b>Dimension</b> : { showVehicle.dimension._length + 'ft. x' + showVehicle.dimension._breadth + 'ft. x' + showVehicle.dimension._height + 'ft.'  }</li>
                                <li><b>Capacity</b> : { showVehicle.capacity + 'Kg' }</li>
                                <li><img src={ showVehicle.image } alt="" style={{width: '100%', marginTop: '20px'}} /></li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Form