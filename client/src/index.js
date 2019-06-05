import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-day-picker/lib/style.css'
import 'react-fancybox/lib/fancybox.css'

import './css/animate.css'
import './css/style.css'

import App from './App'
import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'
import configureStore from './store/Store'
import { saveUserOnLoad, removeUser } from "./actions/User"

const store = configureStore()
store.subscribe(() => {
    //console.log(store.getState())
})

localStorage.getItem('token') ? store.dispatch(saveUserOnLoad(JSON.parse(localStorage.getItem('token')))) : store.dispatch(removeUser())

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
serviceWorker.unregister()