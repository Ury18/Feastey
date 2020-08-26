import Layout from '../app/components/Layout'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import Cookie from "js-cookie"
import Head from 'next/head'

const VerifyUser = (props) => {

    const [verified, setVerified] = useState(props.verified)

    useEffect(() => {
        if (props.verifiedUser) {
            console.log(props.verifiedUser)
            Cookie.set("authToken", props.verifiedUser.token, { expires: 1 })
            updateUserData({ ...props.verifiedUser })
        }
    }, [])

    return (
        <Layout contentClasses="centered">
            <Head>
                <title>Verificación de usuario - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Verificación de usuario - Feastey" key="title" />
                <meta name="description" content="Pagina de verificación de usuarios - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Verificación de usuario - Feastey" />
                <meta name="og:description" property="og:description" content="Pagina de verificación de usuarios - Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
                {/* <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="" />
                <meta name="twitter:description" content={props.desc} />
                <meta name="twitter:site" content="" />
                <meta name="twitter:creator" content="" />
                <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
                <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
                <link rel="stylesheet" href="" />
                <meta property="og:image" content="" />
                <meta name="twitter:image" content="" />
                <link rel="canonical" href="" /> */}
            </Head>
            {verified && <div>
                <h2>Cuenta Verificada</h2>
            </div>}
            {!verified && <div>
                <h2>No se ha podido verificar correctamente</h2>
            </div>}
        </Layout>
    )
}

export const getServerSideProps = async (ctx) => {

    const auth = ctx.query.auth || ""
    let res = await fetch(`${process.env.FEASTEY_API_URL}/users/verify`, {
        headers: {
            "authorization": `Bearer ${auth}`
        },
    })
    res = await res.json()
    if (res.error) {
        return { props: { verified: false } }
    } else {
        return { props: { verifiedUser: res, verified: true } }
    }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(VerifyUser)
