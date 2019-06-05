const initialState = {width: window.innerWidth, height: window.innerHeight}
const screenReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'UPDATE_SCREEN' : 
            return {...state, ...action.payload}
        default: 
            return state
    }
}

export default screenReducer