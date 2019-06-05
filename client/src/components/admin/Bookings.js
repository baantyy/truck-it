import React from 'react'

import AuthHeader from "../common/AuthHeader"

const Bookings = (props) => {

    document.title = 'Bookings | Admin'
    
    return (
        <React.Fragment>
            <AuthHeader />
            <div className="wrapper">
                <div className="admin">
                    
                </div>
            </div>
        </React.Fragment>
    )
}

export default Bookings