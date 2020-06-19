import { parseCookies } from '../app/middleware/parseCookies'
import { wrapper } from '../app/redux/store'
import { userActionTypes } from '../app/redux/user/action'
const { UPDATE_USER_DATA } = userActionTypes

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

MyApp.getInitialProps = async ({ Component, ctx }) => {

    const { store } = ctx
    let pageProps;



    if (Component.getInitialProps) {
        const cookie = parseCookies(ctx.req)
        pageProps = await Component.getInitialProps(ctx)
        pageProps.cookies = cookie

        if (!process.browser) {
            var data = {
                id: cookie.userId || "",
                token: cookie.authToken || ""
            }
            store.dispatch({ type: UPDATE_USER_DATA, data })
        }

    }

    return { pageProps }
}


export default wrapper.withRedux(MyApp)
