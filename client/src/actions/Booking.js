export const addBooking = (booking) => {
    return {
        type: 'ADD_BOOKING',
        payload: booking
    }
}

export const removeBooking = () => {
    return {
        type: 'REMOVE_BOOKING'
    }
}