export const userActionTypes = {
    UPDATE_USER_DATA: "UPDATE_USER_DATA"
}

export const updateUserData = (dispatch, data) => {
    return dispatch({
        type: userActionTypes.UPDATE_USER_DATA,
        data
    })
}
