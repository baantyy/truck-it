import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import DayPicker from 'react-day-picker'

//import { addBooking } from '../../actions/Booking'

class Landing extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pickup: "",
            dropoff: "",
            focusedInput: "",
            places: {
                status: ""
            },
            estimateBtnLoading: false,
            error: "",
            modalShow: false,
            modalStep: 1,
            estimate: {
                distance: "",
                duration: "",
                date: undefined,
                itemVolume: ""
            },
            vehicles: [
                {
                    name: "TATA ACE",
                    image: "trucking.png",
                    dimension: {
                        length: 7,
                        breadth: 5,
                        height: 5
                    },
                    capacity: 750,
                    cost: 1200
                },
                {
                    name: "TATA ACE 2",
                    image: "shipped.png",
                    dimension: {
                        length: 7,
                        breadth: 5,
                        height: 5
                    },
                    capacity: 1250,
                    cost: 2300
                },
                {
                    name: "TATA ACE 3",
                    image: "present.png",
                    dimension: {
                        length: 7,
                        breadth: 5,
                        height: 5
                    },
                    capacity: 2550,
                    cost: 4200
                }
            ]
        }
    }

    componentDidMount(){
        //api to get vehicles + estimate
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value,
            focusedInput: e.target.name,
            error: ""
        }))

        // if(['pickup','dropoff'].includes(e.target.name)){
        //     axios.get(`/api/location/place/${e.target.value}`)
        //         .then(res => {
        //             this.setState(() => ({
        //                 places: res.data
        //             }))
        //             //console.log(res.data)
        //         })
        // }
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
        //const { pickup, dropoff } = this.state
        // axios.get(`/api/location/distance/${pickup}/${dropoff}`)
        //     .then(res => {
        //         if(res.data.rows.length){
        //             if(res.data.rows[0].elements[0].status === "OK"){
        //                 this.setState(() => ({
        //                     estimateBtnLoading: false,
        //                     estimate: {
        //                         distance: res.data.rows[0].elements[0].distance.text,
        //                         duration: res.data.rows[0].elements[0].duration.text
        //                     },
        //                     modalStep: 1
        //                 }))
        //                 this.modalOpen()
        //                 console.log(res.data.rows[0].elements[0].distance)
        //             }else{
        //                 this.setState(() => ({
        //                     estimateBtnLoading: false,
        //                     error: "Service not available for these locations"
        //                 }))
        //             }
        //         }else{
        //             this.setState(() => ({
        //                 error: "Service not available for these locations"
        //             }))
        //         }
        //     })
        this.setState(() => ({
            estimate: {
                distance: "",
                duration: "",
                date: undefined,
                itemVolume: ""
            },
            estimateBtnLoading: false,
            modalStep: 1
        }))
        this.modalOpen()
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
        this.setState((prevState) => ({
            estimate: {...prevState.estimate, ...{date}}
        }))
    }

    changeModalStep = (step) => {
        this.setState({ modalStep: step })
    }

    handleRadioChange = (volume) => {
        this.setState((prevState) => ({
            estimate: {...prevState.estimate, ...{itemVolume: volume}}
        }))
    }

    render(){
        var twoMonths = new Date()
        twoMonths.setMonth(twoMonths.getMonth() + 2)
        const { pickup, dropoff, estimateBtnLoading, places, error, modalShow, modalStep, estimate, vehicles } = this.state
        const { screen } = this.props
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
                                    { estimate.date && <p>{estimate.date.toLocaleDateString('en-GB')}</p> }
                                </div>
                            </Modal.Body>
                            { estimate.date &&
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
                                        {['Few Items','1 BHK','2 BHK','3 BHK','4 BHK','Custom'].map((item, index) => {
                                            return (
                                                <Form.Check
                                                    key={index}
                                                    custom
                                                    label={item}
                                                    type="radio"
                                                    name="itemVolume"
                                                    id={`choose-item-${index}`}
                                                    onChange={() => {
                                                        this.handleRadioChange(item)
                                                    }}
                                                    checked={estimate.itemVolume === item ? true : false}
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
                                { estimate.itemVolume && 
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
                                        {vehicles.map((vehicle, index) => {
                                            return (
                                                <div key={index} className="col-sm-6">
                                                    <div className="item">
                                                        <h3>{ vehicle.name }</h3>
                                                        <img src={`img/${ vehicle.image }`} alt="" />
                                                        <p>Capacity: <b>{ vehicle.capacity } kgs</b></p>
                                                        <p>Size (LxBxH): <b>{`${vehicle.dimension.length}ft x ${vehicle.dimension.breadth}ft x ${vehicle.dimension.height}ft`}</b></p>

                                                        <div className="estimateCost"><i className="fas fa-rupee-sign"></i> {`${vehicle.cost}/-`}</div>
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