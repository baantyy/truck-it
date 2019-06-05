const initialState = {}
const bookingReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_BOOKING':
            return {...state, ...action.payload}
        default:
            return state
    }
}

export default bookingReducer