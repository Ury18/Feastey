import { cookiesActionTypes } from './action'

const cookiesInitialState = {
}

export default function reducer(state = cookiesInitialState, action) {
    switch (action.type) {

        case cookiesActionTypes.UPDATE_COOKIES_DATA:
            return Object.assign({}, state, { ...action.data })

        default:
            return state
    }

}
