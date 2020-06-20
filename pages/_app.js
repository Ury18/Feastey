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

    if (Component.getInitialProps) {
        const cookie = parseCookies(ctx.req)
        pageProps = await Component.getInitialProps(ctx)

        if (!process.browser) {
            var data = {}

            if(cookie.userId) {
                data.id = cookie.userId
            }

            if(cookie.authToken) {
                data.token = cookie.authToken
            }

            store.dispatch({ type: UPDATE_COOKIES_DATA, data: cookie })
            store.dispatch({ type: UPDATE_USER_DATA, data: data })
        }

    }

    return { pageProps }
}


export default wrapper.withRedux(MyApp)
