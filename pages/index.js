import Layout from '../app/components/Layout'
import Discover from '../app/components/Discover'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import Cookie from "js-cookie"
import Head from 'next/head'

const Index = (props) => {
    const { updateUserData } = props
    return (
        <Layout>
            <Head>
                <title>Bienvenido a Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Bienvenido a Feastey" key="title" />
                <meta name="description" content="Bienvenido a Feastey - Descubre tu barrio" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Bienvenido a Feastey" />
                <meta name="og:description" property="og:description" content="Bienvenido a Feastey - Descubre tu barrio" />
                <meta property="og:site_name" content="ury.feastey.com" />
            </Head>
            <Discover/>
            <p>{props.user.name}</p>
            <button onClick={() => Cookie.remove("authToken", {path: "/"})}>Delete Cookie</button>
        </Layout>
    )
}

Index.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Index)


