import { parseCookies } from '../app/middleware/parseCookies'
import { wrapper } from '../app/redux/store'

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

MyApp.getInitialProps = async ({ Component, ctx }) => {

    let pageProps;

    if (Component.getInitialProps) {
        const cookie = parseCookies(ctx.req)
        pageProps = await Component.getInitialProps(ctx)
        pageProps.cookies = cookie
    }
    return { pageProps }
}


export default wrapper.withRedux(MyApp)
