import React from 'react'

export const SpinnerGif = () => {
    return (
        <div className="pageLoader">
            <img src="img/spinner.gif" alt="Spinner" />
        </div>
    )
}

export const SpinnerGlow = () => {
    return (
        <div className="pageLoader">
            <div className="spinner-grow" role="status"></div>
        </div>
    )
}