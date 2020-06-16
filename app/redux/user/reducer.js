import { userActionTypes } from './action'

const userInitialState = {
    user: {}
}

export default function reducer (state = userInitialState, action) {
    switch(action.type) {

        case userActionTypes.UPDATE_USER_DATA:
            return Object.assign({},state, {user: action.data})

        default:
            return state
    }
}
