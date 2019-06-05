import React from 'react'

const Footer = (props) => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <p>Copyright &copy; 2019 | All Rights Reserved</p>
                    </div>
                    <div className="col-md-6">
                        <ul>
                            <li><a href="/" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="/" target="_blank"><i className="fab fa-whatsapp"></i></a></li>
                            <li><a href="/" target="_blank"><i className="fab fa-linkedin-in"></i></a></li>
                            <li><a href="/" target="_blank"><i className="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer