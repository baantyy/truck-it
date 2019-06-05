import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import userReducer from '../reducers/User'
import bookingReducer from '../reducers/Booking'
import screenReducer from '../reducers/Screen'

const configureStore = () => {
    const store = createStore(combineReducers({
        user: userReducer,
        booking: bookingReducer,
        screen: screenReducer
    }), applyMiddleware(thunk))
    return store
}

export default configureStore