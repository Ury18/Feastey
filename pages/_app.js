import Cookie from "js-cookie"
import { parseCookies } from '../app/middleware/parseCookies'
import { wrapper } from '../app/redux/store'
import { userActionTypes } from '../app/redux/user/action'
import { cookiesActionTypes } from '../app/redux/cookies/action'

const { UPDATE_USER_DATA } = userActionTypes
const { UPDATE_COOKIES_DATA } = cookiesActionTypes

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

MyApp.getInitialProps = async ({ Component, ctx }) => {

    const { store } = ctx
    let pageProps;
    const cookie = parseCookies(ctx.req)

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
    }

    if (!process.browser) {
        var data = {}

        if (cookie.authToken) {
            return fetch('http://localhost:3000/api/users/authenticate/renew', {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${cookie.authToken}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        console.log(res.error)
                        Cookie.remove("authToken")
                        return { pageProps }
                    } else {
                        data = res
                        store.dispatch({ type: UPDATE_USER_DATA, data })
                        // store.dispatch({ type: UPDATE_COOKIES_DATA, data: cookie })
                        return { pageProps }
                    }
                })
                .catch(err => {
                    console.log(err.error)
                    Cookie.remove("authToken")
                    return { pageProps }
                })
        } else {
            return { pageProps }
        }
    }
}


export default wrapper.withRedux(MyApp)
