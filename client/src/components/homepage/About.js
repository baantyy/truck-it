import React from 'react'

const About = (props) => {
    return (  
        <div className="about" id="about">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="img">
                            <img src="img/about.svg" alt="" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="content">
                            <div>
                                <h2>Why Choose Us</h2>

                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

                                <p>When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.</p>

                                <ul>
                                    <li><i className="far fa-dot-circle"></i> It is a long established fact.</li>
                                    <li><i className="far fa-dot-circle"></i> It has a more-or-less normal distribution of letters.</li>
                                    <li><i className="far fa-dot-circle"></i> Many desktop publishing packages and web page editors.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About