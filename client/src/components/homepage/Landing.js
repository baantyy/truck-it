import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import DayPicker from 'react-day-picker'
import $ from 'jquery'
import { Link } from 'react-router-dom'

import { addBooking } from '../../actions/Booking'

class Landing extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pickup: "",
            dropoff: "",
            pickup_date: undefined,
            distance: {},
            duration: {},
            volume: "",
            truck: "",
            amount: "",

            focusedInput: "",
            places: {
                status: ""
            },
            estimateBtnLoading: false,
            error: "",
            modalShow: false,
            modalStep: 1,
            vehicles: [],
            volumes: [
                { name: "Few Items", price: 5 },
                { name: "1 BHK", price: 10 },
                { name: "2 BHK", price: 20 },
                { name: "3 BHK", price: 30 },
                { name: "4 BHK", price: 40 },
                { name: "Custom", price: 50 }
            ]
        }
    }

    componentDidMount(){
        axios.get("/api/users/vehicles")
            .then(res => {
                this.setState(() => ({
                    vehicles: res.data
                }))
            })
        
        $(document).on("click", ".chooseVehicle .item", function(){
            $(this).addClass("active")
            $(this).parent(".col-sm-6").siblings().find(".item").removeClass("active")
        })
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value,
            focusedInput: e.target.name,
            error: ""
        }))

        if(['pickup','dropoff'].includes(e.target.name)){
            axios.get(`/api/location/place/${e.target.value}`)
                .then(res => {
                    this.setState(() => ({
                        places: res.data
                    }))
                })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { pickup, dropoff } = this.state
        if(pickup && dropoff){
            this.setState(() => ({
                estimateBtnLoading: true,
                error: ""
            }))
            this.getDistance()
        }else{
            this.setState(() => ({ error: "Enter address to get estimate" }))
        }
    }

    getDistance = () => {
        const { pickup, dropoff } = this.state
        axios.get(`/api/location/distance/${pickup}/${dropoff}`)
            .then(res => {
                if(res.data.rows.length){
                    if(res.data.rows[0].elements[0].status === "OK"){
                        this.setState(() => ({
                            estimateBtnLoading: false,
                            distance: res.data.rows[0].elements[0].distance,
                            duration: res.data.rows[0].elements[0].duration,
                            pickup_date: undefined,
                            modalStep: 1
                        }))
                        if((res.data.rows[0].elements[0].distance.value / 1000) <= 200){
                            this.modalOpen()
                        }else{
                            this.setState(() => ({
                                estimateBtnLoading: false,
                                error: "Service not available for these locations"
                            }))
                        }
                    }else{
                        this.setState(() => ({
                            estimateBtnLoading: false,
                            error: "Service not available for these locations"
                        }))
                    }
                }else{
                    this.setState(() => ({
                        estimateBtnLoading: false,
                        error: "Service not available for these locations"
                    }))
                }
            })
    }

    updateAddress = (value) => {
        this.setState((prevState) => ({
            [prevState.focusedInput]: value,
            places: {
                status: ""
            }
        }))
    }

    modalClose = () => {
        this.setState({ modalShow: false })
    }

    modalOpen = () => {
        this.setState({ modalShow: true })
    }

    handleDayClick = (date) => {
        this.setState(() => ({
            pickup_date: date
        }))
    }

    changeModalStep = (step) => {
        this.setState({ modalStep: step })
    }

    handleRadioChange = (volume) => {
        this.setState(() => ({
            volume
        }))
    }

    handleSelectTruck = (truck, amount) => {
        const { pickup, dropoff, pickup_date, volume, distance, duration } = this.state
        this.setState(() => ({
            truck, amount
        }))
        const bookingData = {
            pickup, dropoff, pickup_date, volume: volume.name, distance, duration, truck, amount
        }
        this.props.dispatch(addBooking(bookingData))
    }

    render(){
        var twoMonths = new Date()
        twoMonths.setMonth(twoMonths.getMonth() + 2)
        const { pickup, dropoff, pickup_date, volume, estimateBtnLoading, places, error, modalShow, modalStep, vehicles, volumes, distance, truck } = this.state
        const { screen, user } = this.props
        const loginMsg = user.status === "false" ? "Login to continue " : "Book Now "
        const userRole = user.status === "true" ? user.role === "customer" ? true : false : true
        return (
            <React.Fragment>
                <div className="landing">
                    { screen.width > 576 ?
                        <img className="rightImg" src="img/homeBanner1.svg" alt="Home Banner" /> :
                        <img className="rightImg" src="img/homeBanner2.svg" alt="Home Banner" /> 
                    }
                    <div className="container">
                        <div className="content">

                            <h1>Best Packers &amp; Movers in Bangalore</h1>
                            <ul>
                                <li><i className="far fa-dot-circle"></i> Superior packaging at best rates</li>
                                <li><i className="far fa-dot-circle"></i> Free insurance up to Rs.1,00,000</li>
                                <li><i className="far fa-dot-circle"></i> Trained &amp; verified Packers &amp; Movers</li>
                            </ul>

                            <form className="estimateForm" onSubmit={this.handleSubmit}>
                                <input type="text"
                                        placeholder="Pickup Address"
                                        name="pickup"
                                        onChange={this.handleChange}
                                        value={pickup}
                                />
                                <input type="text"
                                        placeholder="Dropoff Address"
                                        name="dropoff" 
                                        onChange={this.handleChange}
                                        value={dropoff}
                                />
                                <button>{estimateBtnLoading ? <i className="fas fa-spin fa-circle-notch"></i> : "Get Estimate" }</button>
                            </form>

                            { places.status === "OK" &&                                 
                                <ol className="showPlaces">
                                    { places.predictions.map((place, index) => {
                                            return (
                                                <li key={index} onClick={() => {
                                                    this.updateAddress(place.description)
                                                }}>{place.description}</li>
                                            )
                                        })
                                    }
                                </ol>
                            }

                            { error && <p className="status text-danger">{ error }</p>}

                        </div>
                    </div>                
                </div>

                <Modal show={modalShow} onHide={this.modalClose} centered>
                    { modalStep === 1 ?

                        // STEP 1 - MODAL //
                        <React.Fragment>
                            <Modal.Header closeButton>
                                <Modal.Title>Choose Shifting Date</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="chooseDate">
                                    <DayPicker onDayClick={this.handleDayClick}
                                               disabledDays={{ 
                                                    before: new Date(),
                                                    after: twoMonths
                                                }}
                                        />
                                    { pickup_date && <p>{pickup_date.toLocaleDateString('en-GB')}</p> }
                                </div>
                            </Modal.Body>
                            { pickup_date &&
                                <Modal.Footer>
                                    <Button className="right"
                                            onClick={() => {
                                                this.changeModalStep(2)
                                            }}
                                    >Next <i className="fas fa-angle-right"></i></Button>
                                </Modal.Footer>
                            }
                        </React.Fragment> : modalStep === 2 ?

                        // STEP 2 - MODAL //
                        <React.Fragment>
                            <Modal.Header closeButton>
                                <Modal.Title>Choose Shifting Volume</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="chooseVolume">
                                    <Form>
                                        {volumes.map((item, index) => {
                                            return (
                                                <Form.Check
                                                    key={index}
                                                    custom
                                                    label={item.name}
                                                    type="radio"
                                                    name="volume"
                                                    id={`choose-item-${index}`}
                                                    onChange={() => {
                                                        this.handleRadioChange(item)
                                                    }}
                                                    checked={volume === item ? true : false}
                                                />
                                            )
                                        })}
                                    </Form>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="left"                                        
                                        onClick={() => {
                                            this.changeModalStep(1)
                                        }}                                
                                ><i className="fas fa-angle-left"></i> Go Back</Button>
                                { volume && 
                                    <Button className="right"                                        
                                            onClick={() => {
                                                this.changeModalStep(3)
                                            }}
                                    >Next <i className="fas fa-angle-right"></i></Button>
                                }
                            </Modal.Footer>
                        </React.Fragment> : modalStep === 3 &&

                        //STEP 3 - MODAL
                        <React.Fragment>
                            <Modal.Header closeButton>
                                <Modal.Title>Choose Shifting Vehicle</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="chooseVehicle">
                                    <div className="row">
                                        {vehicles.map(vehicle => {
                                            const estimatedCost = parseInt((vehicle.price * (distance.value / 1000) * volume.price))
                                            return (
                                                <div key={vehicle._id} className="col-sm-6">
                                                    <div className={`item ${vehicle._id === truck ? 'active' : ''}`}
                                                         onClick={() => {
                                                             this.handleSelectTruck(vehicle._id, estimatedCost)
                                                         }}
                                                        >
                                                        <h3>{ vehicle.name }</h3>
                                                        <img src={vehicle.image} alt="" />
                                                        <p>Capacity: <b>{ vehicle.capacity } kgs</b></p>
                                                        <p>Size (LxBxH): <b>{`${vehicle.dimension._length}ft x ${vehicle.dimension._breadth}ft x ${vehicle.dimension._height}ft`}</b></p>

                                                        <div className="estimateCost"><i className="fas fa-rupee-sign"></i> {`${estimatedCost}/-`}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="left"                                        
                                        onClick={() => {
                                            this.changeModalStep(2)
                                        }}                                
                                ><i className="fas fa-angle-left"></i> Go Back</Button>

                                { (truck && userRole) && <Link className="right" to="/login">{loginMsg} <i className="fas fa-angle-right"></i></Link> }
                                
                            </Modal.Footer>
                        </React.Fragment>
                    }
                </Modal> 
            </React.Fragment>             
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        booking: state.booking,
        screen: state.screen
    }
}

export default connect(mapStateToProps)(Landing)