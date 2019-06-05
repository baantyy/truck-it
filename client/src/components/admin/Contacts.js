import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Modal } from 'react-bootstrap'

import AuthHeader from "../common/AuthHeader"

class Contacts extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            contacts: [],
            filteredContacts: [],
            filteredSearch: [],
            search: "",
            modalShow: false,
            modalContact: {}
        }
    }

    componentDidMount(){
        document.title = 'Messages | Admin'
        const { user } = this.props

        axios.get("/api/admin/contacts",{
                headers: { 'x-auth': user.token }
            })
            .then(res => {
                this.setState(() => ({
                    contacts: res.data,
                    filteredContacts: res.data,
                    filteredSearch: res.data
                }))
            })
        
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            search: value,
            filteredContacts: prevState.filteredSearch.filter(contact => contact.name.toLowerCase().includes(value.toLowerCase()))
        }))
    }

    handleDelete = (id) => {
        const { user } = this.props
        if(window.confirm("Are you sure ?")){
            axios.delete(`/api/admin/contacts/${id}`,{
                    headers: { 'x-auth': user.token }
                })
                .then(res => {
                    if(res.data.success){
                        this.setState((prevState) => ({
                            contacts: prevState.contacts.filter(contact => contact._id !== id),
                            filteredContacts: prevState.filteredContacts.filter(contact => contact._id !== id),
                            filteredSearch: prevState.filteredSearch.filter(contact => contact._id !== id)
                        }))
                    }else{
                        console.log(res.data)
                    }
                })
        }
    }

    modalClose = () => {
        this.setState(() => ({ 
            modalShow: false 
        }))
    }

    modalOpen = (id) => {
        this.setState((prevState) => ({ 
            modalShow: true,
            modalContact: prevState.contacts.find(contact => contact._id === id)
        }))
    }
    
    render(){
        const { search, filteredContacts, modalShow, modalContact } = this.state
        return (
            <React.Fragment>
                <AuthHeader />
                <div className="wrapper">
                    <div className="admin">
                        <div className="container">
                            <div className="inlineHeading">
                                <h1>Contact Messages ({filteredContacts.length})</h1>
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
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { filteredContacts.length ?
                                            filteredContacts.map((contact, index) => {
                                                return (
                                                    <tr key={ contact._id }>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ contact.name }</td>
                                                        <td>{ contact.email }</td>
                                                        <td>{ contact.mobile }</td>  
                                                        <td>{ contact.sentAt }</td>  
                                                        <td>
                                                            <button className="view"
                                                                    title="View"
                                                                    onClick={() => {
                                                                        this.modalOpen(contact._id)
                                                                    }}
                                                            ><i className="fas fa-book"></i></button>

                                                            <button className="del"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        this.handleDelete(contact._id)
                                                                    }}
                                                            ><i className="fas fa-trash-alt"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="6" className="text-center">No Messages</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={modalShow} onHide={this.modalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{ modalContact.name && modalContact.name }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{padding: '30px'}}>
                        <table className="table table-bordered" style={{fontSize: '14px', margin: 0}}>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{ modalContact.name && modalContact.name }</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{ modalContact.email && modalContact.email }</td>
                                </tr>
                                <tr>
                                    <th>Mobile</th>
                                    <td>{ modalContact.mobile && modalContact.mobile }</td>
                                </tr>
                                <tr>
                                    <th>Message</th>
                                    <td>{ modalContact.message && modalContact.message }</td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Contacts)