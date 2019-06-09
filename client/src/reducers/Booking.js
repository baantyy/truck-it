const initialState = { status: false }
const bookingReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_BOOKING':
            return {...state, ...action.payload, ...{ status: true }}
        case 'REMOVE_BOOKING':
            return { status: false }
        default:
            return state
    }
}

export default bookingReducer