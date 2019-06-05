import axios from "axios"

export const saveUser = (user) => {
    return {
        type: 'SAVE_USER',
        payload: user
    }
}

export const updateUser = (user) => {
    return {
        type: 'UPDATE_USER',
        payload: user
    }
}

export const removeUser = () => {
    return {
        type: 'REMOVE_USER'
    }
}

export const saveUserOnLoad = (token) => {
    return (dispatch) => {
        axios.get(`/api/users/token/${token}`)
            .then(res => {
                dispatch(saveUser(res.data))
            })
            .catch(err => {
                dispatch(removeUser())
            })
    }
}