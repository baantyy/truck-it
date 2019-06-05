import React from 'react'

const Services = (props) => {
    return (  
        <div className="services" id="services">
            <img src="img/serviceBg.png" alt="" />
            <div className="container">
                <h2>Features loved by our customers</h2>
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="item">
                            <div className="img">
                                <img src="img/shipped.png" alt="" />
                            </div>
                            <h3>Fastest Shifting</h3>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="item">
                            <div className="img">
                                <img src="img/location.png" alt="" />
                            </div>
                            <h3>Live Tracking</h3>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="item">   
                            <div className="img">                          
                                <img src="img/customer-service.png" alt="" />
                            </div>
                            <h3>24x7 Customer Service</h3>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services