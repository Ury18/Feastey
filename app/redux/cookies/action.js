export const cookiesActionTypes = {
    UPDATE_COOKIES_DATA: "UPDATE_COOKIES_DATA"
}

export const updateCookiesData = (data) => {
    return {
        type: cookiesActionTypes.UPDATE_COOKIES_DATA,
        data
    }
}
