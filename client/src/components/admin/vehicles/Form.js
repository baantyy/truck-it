import React from 'react'

class Form extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: props.vehicle ? props.vehicle.name : "",
            image: props.vehicle ? props.vehicle.image : "",
            _length: props.vehicle ? props.vehicle.dimension._length : "",
            _breadth: props.vehicle ? props.vehicle.dimension._breadth : "",
            _height: props.vehicle ? props.vehicle.dimension._height : "",
            capacity: props.vehicle ? props.vehicle.capacity : "",
            old_image: props.vehicle ? props.vehicle.image : "",
            price: props.vehicle ? props.vehicle.price : ""
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { name, image, _length, _breadth, _height, capacity, price } = this.state
        const formdata = new FormData()
        formdata.append('name', name)
        formdata.append('image', image)
        formdata.append('_length', _length)
        formdata.append('_breadth', _breadth)
        formdata.append('_height', _height)
        formdata.append('capacity', capacity)
        formdata.append('price', price)

        this.props.handleSubmit(formdata)
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    handleFileChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.files[0]
        }))
    }

    render(){
        const { name, image, _length, _breadth, _height, capacity, old_image, price } = this.state
        const { isSubmitting, errors } = this.props
        console.log(errors)
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <label className="label">Name</label>
                <input type="text"
                       placeholder="Name"
                       className="field"
                       value={name}
                       onChange={this.handleChange}
                       name="name" 
                    />
                { errors.name && <p className="error">{ errors.name.message }</p> }

                <label className="label">Image</label>
                <input type="file"
                       className="field"
                       onChange={this.handleFileChange}
                       name="image" 
                    />
                { errors.image && <p className="error">{ errors.image.message }</p> }
                { image && <img src={old_image} alt="" /> }
                
                <div className="row">
                    <div className="col-4">

                        <label className="label">Length</label>
                        <input type="text"
                               placeholder="in ft"
                               className="field"
                               value={_length}
                               onChange={this.handleChange}
                               name="_length" 
                            />
                        { errors['dimension._length'] && <p className="error">{ errors['dimension._length'].message }</p> }

                    </div>
                    <div className="col-4">

                        <label className="label">Breadth</label>
                        <input type="text"
                               placeholder="in ft"
                               className="field"
                               value={_breadth}
                               onChange={this.handleChange}
                               name="_breadth" 
                            />
                        { errors['dimension._breadth'] && <p className="error">{ errors['dimension._breadth'].message }</p> }

                    </div>
                    <div className="col-4">

                        <label className="label">Height</label>
                        <input type="text"
                               placeholder="in ft"
                               className="field"
                               value={_height}
                               onChange={this.handleChange}
                               name="_height" 
                            />
                        { errors['dimension._height'] && <p className="error">{ errors['dimension._height'].message }</p> }

                    </div>
                    <div className="col-6">

                        <label className="label">Capacity</label>
                        <input type="text"
                                placeholder="in kg"
                                className="field"
                                value={capacity}
                                onChange={this.handleChange}
                                name="capacity" 
                            />
                        { errors.capacity && <p className="error">{ errors.capacity.message }</p> }

                    </div>
                    <div className="col-6">

                        <label className="label">Price (Per KM)</label>
                        <input type="text"
                                placeholder="Rs"
                                className="field"
                                value={price}
                                onChange={this.handleChange}
                                name="price" 
                            />
                        { errors.price && <p className="error">{ errors.price.message }</p> }

                    </div>
                </div>

                <button className="button" disabled={isSubmitting}>
                { isSubmitting ? <i className="fas fa-spin fa-circle-notch"></i> : 'Submit' }</button>
            </form>
        )
    }
}

export default Form