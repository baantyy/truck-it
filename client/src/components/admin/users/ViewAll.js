import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import $ from 'jquery'

import AuthHeader from "../../common/AuthHeader"

class ViewAll extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            filteredUsers: [],
            filteredSearch: [],
            search: ""
        }
    }

    componentDidMount(){
        document.title = 'Users | Admin'
        const { user } = this.props
        axios.get("/api/admin/users",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    users: res.data,
                    filteredUsers: res.data,
                    filteredSearch: res.data
                }))
            })
        
        $(".userFilter button").on("click", function(){
            $(this).addClass("active")
            $(this).siblings().removeClass("active")
        })
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredUsers: prevState.filteredSearch.filter(user => user.fullname.toLowerCase().includes(value.toLowerCase()) || user.mobile.toLowerCase().includes(value.toLowerCase()) || user.email.toLowerCase().includes(value.toLowerCase()) || user.role.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    handleVendorDelete = (id) => {
        const { user } = this.props
        axios.delete(`/api/admin/vendors/${id}`,{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                if(res.data.success){
                    this.setState((prevState) => ({
                        users: prevState.users.filter(user => user._id !== id),
                        filteredUsers: prevState.filteredUsers.filter(user => user._id !== id),
                        filteredSearch: prevState.filteredSearch.filter(user => user._id !== id)
                    }))
                }else{
                    console.log(res.data)
                }
            })
    }

    handleDelete = (id, role) => {
        const { user } = this.props
        if(window.confirm("Are you sure ?")){
            axios.delete(`/api/admin/users/${id}`,{
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    if(res.data.success){
                        if(role === "vendor"){
                            this.handleVendorDelete(id)
                        }else{
                            this.setState((prevState) => ({
                                users: prevState.users.filter(user => user._id !== id),
                                filteredUsers: prevState.filteredUsers.filter(user => user._id !== id),
                                filteredSearch: prevState.filteredSearch.filter(user => user._id !== id)
                            }))
                        }
                    }else{
                        console.log(res.data)
                    }
                })
        }
    }

    filterRole = (role) => {
        this.setState((prevState) => ({
            filteredUsers: prevState.users.filter(user => role === 'all' ? user : user.role === role),
            filteredSearch: prevState.users.filter(user => role === 'all' ? user : user.role === role)
        }))
    }
    
    render(){
        const { search, filteredUsers } = this.state
        const pagination = (filteredUsers.length / 10) + (filteredUsers.length % 10 !== 0) ? 1 : 0
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <h1>All Users ({filteredUsers.length})</h1>
                            <div className="inlineHeading">
                                <div className="btnGroup userFilter">
                                    <button className="active"
                                            onClick={() => {
                                                this.filterRole('all')
                                            }}
                                        >All</button>
                                    <button onClick={() => {
                                                this.filterRole('customer')
                                            }}
                                        >Customer</button>
                                    <button onClick={() => {
                                                this.filterRole('vendor')
                                            }}
                                        >Vendor</button>
                                    <button onClick={() => {
                                                this.filterRole('admin')
                                            }}
                                        >Admin</button>
                                </div>
                                <input type="text" 
                                       placeholder="Search Here"
                                       onChange={this.handleSearch}
                                       value={search}
                                    />
                            </div>
                            <div className="tableBox">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sl. No.</th>
                                            <th>Fullname</th>
                                            <th>Mobile</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Access</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredUsers.length ?
                                            filteredUsers.map((user, index) => {
                                                return (
                                                    <tr key={ user._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ user.fullname }</td>
                                                        <td>{ user.mobile }</td>
                                                        <td>{ user.email }</td>
                                                        <td className="cap">{ user.role }</td>
                                                        <td>{ user.allowAccess ? <span className="text-success">Allowed</span> : <span className="text-danger">Not Allowed</span> }</td>
                                                        <td>
                                                            <Link className="edit" 
                                                                  title="Edit" 
                                                                  to={`/admin/users/edit/${user._id}`}
                                                            ><i className="fas fa-pen"></i></Link>

                                                            <Link className="edit view" 
                                                                  title="View" 
                                                                  to={`/admin/users/${user._id}`}
                                                            ><i className="fas fa-book"></i></Link>

                                                            <button className="del"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        this.handleDelete(user._id, user.role)
                                                                    }}
                                                            ><i className="fas fa-trash-alt"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="7" className="text-center">No User Found</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                            { pagination > 0 &&
                            <nav className="paginationBlock">
                                <ul className="pagination">
                                    
                                        <li className="page-item">
                                            {/* <a className="page-link" href="#">1</a> */}
                                        </li>
                                </ul>
                            </nav>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ViewAll)