const initialState = {}
const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SAVE_USER': 
            return { ...action.payload, ...{ status: "true" }}
        case 'UPDATE_USER':
            return {...state, ...action.payload}
        case 'REMOVE_USER': 
            return { status: "false" }
        default: 
            return state
    }
}

export default userReducer