export const userActionTypes = {
    UPDATE_USER_DATA: "UPDATE_USER_DATA"
}

export const updateUserData = (data) => {
    return {
        type: userActionTypes.UPDATE_USER_DATA,
        data
    }
}
