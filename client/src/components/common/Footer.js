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
                            <li><a href="https://www.facebook.com/baantyy" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="https://api.whatsapp.com/send?phone=917978400978" target="_blank"><i className="fab fa-whatsapp"></i></a></li>
                            <li><a href="https://www.linkedin.com/in/baantyy" target="_blank"><i className="fab fa-linkedin-in"></i></a></li>
                            <li><a href="https://www.instagram.com/baantyy" target="_blank"><i className="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer