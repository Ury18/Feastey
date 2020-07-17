import Layout from '../app/components/Layout'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'
import Cookie from "js-cookie"

const VerifyUser = (props) => {

    const [verified, setVerified] = useState(props.verified)

    useEffect(() => {
        if (props.verifiedUser) {
            console.log(props.verifiedUser)
            Cookie.set("authToken", props.verifiedUser.token)
            updateUserData({ ...props.verifiedUser})
        }
    },[])

    return (
        <Layout contentClasses="centered">
            {verified && <div>
                <h1>Cuenta Verificada</h1>
            </div>}
            {!verified && <div>
                <h1>No se ha podido verificar correctamente</h1>
            </div>}
        </Layout>
    )
}

VerifyUser.getInitialProps = async (ctx) => {

    const auth = ctx.query.auth || ""
    let res = await fetch(`${process.env.FEASTEY_API_URL}/users/verify`, {
        headers: {
            "authorization": `Bearer ${auth}`
        },
    })
    res = await res.json()
    if (res.error) {
        return { verified: false }
    } else {
        return { verifiedUser: res ,verified: true }
    }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(VerifyUser)
