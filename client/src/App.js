import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import CustomerRoute from "./components/route/CustomerRoute"
import VendorRoute from "./components/route/VendorRoute"
import AdminRoute from "./components/route/AdminRoute"

import Home from "./components/homepage/Home"
import Login from "./components/auth/Login"
import Logout from "./components/auth/Logout"
import Register from "./components/auth/Register"

import CustomerViewAllBookings from "./components/customer/bookings/ViewAll"
import CustomerViewOneBooking from "./components/customer/bookings/ViewOne"
import CustomerAddBooking from "./components/customer/bookings/Add"

import CustomerProfile from "./components/customer/MyProfile"

import VendorBookings from "./components/vendor/Bookings"
import VendorProfile from "./components/vendor/MyProfile"

import VendorViewAllVehicles from "./components/vendor/vehicles/ViewAll"
import VendorViewOneVehicle from "./components/vendor/vehicles/ViewOne"
import VendorAddVehicle from "./components/vendor/vehicles/Add"
import VendorEditVehicle from "./components/vendor/vehicles/Edit"

import AdminBookings from "./components/admin/Bookings"
import AdminContacts from "./components/admin/Contacts"

import AdminViewAllUsers from "./components/admin/users/ViewAll"
import AdminViewOneUser from "./components/admin/users/ViewOne"
import AdminEditUser from "./components/admin/users/Edit"

import AdminViewAllVehicles from "./components/admin/vehicles/ViewAll"
import AdminAddVehicle from "./components/admin/vehicles/Add"
import AdminEditVehicle from "./components/admin/vehicles/Edit"

import { SpinnerGlow } from './components/common/Spinner'

const App = (props) => {
    return (
        <BrowserRouter>
            { props.user.status ?
            <div className="app">          
                <Switch>

                    <Route path="/" component={Home} exact={true} />
                    <Route path="/login" component={Login} exact={true} />
                    <Route path="/register" component={Register} exact={true} />
                    <Route path="/logout" component={Logout} exact={true} />

                    <CustomerRoute path="/customer" component={CustomerViewAllBookings} exact={true} />
                    <CustomerRoute path="/customer/bookings/add" component={CustomerAddBooking} exact={true} />
                    <CustomerRoute path="/customer/bookings/:id" component={CustomerViewOneBooking} exact={true} />

                    <CustomerRoute path="/customer/my-profile" component={CustomerProfile} exact={true} />

                    <VendorRoute path="/vendor" component={VendorBookings} exact={true} />
                    <VendorRoute path="/vendor/my-profile" component={VendorProfile} exact={true} />

                    <VendorRoute path="/vendor/vehicles" component={VendorViewAllVehicles} exact={true} />
                    <VendorRoute path="/vendor/vehicles/add" component={VendorAddVehicle} exact={true} />
                    <VendorRoute path="/vendor/vehicles/:id" component={VendorViewOneVehicle} exact={true} />
                    <VendorRoute path="/vendor/vehicles/edit/:id" component={VendorEditVehicle} exact={true} />
                    
                    <AdminRoute path="/admin" component={AdminBookings} exact={true} />
                    <AdminRoute path="/admin/contacts" component={AdminContacts} exact={true} />

                    <AdminRoute path="/admin/users" component={AdminViewAllUsers} exact={true} />
                    <AdminRoute path="/admin/users/:id" component={AdminViewOneUser} exact={true} />
                    <AdminRoute path="/admin/users/edit/:id" component={AdminEditUser} exact={true} />

                    <AdminRoute path="/admin/vehicles" component={AdminViewAllVehicles} exact={true} />
                    <AdminRoute path="/admin/vehicles/add" component={AdminAddVehicle} exact={true} />
                    <AdminRoute path="/admin/vehicles/edit/:id" component={AdminEditVehicle} exact={true} />

                </Switch>
            </div> : <SpinnerGlow />
            }
        </BrowserRouter>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(App)