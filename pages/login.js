import Layout from '../app/components/Layout'
import Cookie from "js-cookie"
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'

const LogIn = (props) => {

    const router = useRouter()

    const { cookie, updateUserData } = props
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")

    const logIn = (e, data) => {
        e.preventDefault()

        fetch(`${process.env.FEASTEY_API_URL}/users/authenticate`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setErrors(res.error)
                } else {
                    Cookie.set("authToken", res.token)
                    console.log(res)
                    updateUserData({ ...res })
                    router.push('/')
                }
            })
            .catch(err => {
                setErrors(err.error)
            })
    }

    return (
        <Layout contentClasses="centered">
            <Head>
                <title>Feastey - Inicia sesión</title>
            </Head>
            <form onSubmit={(e) => logIn(e, { email, password })} style={{ maxWidth: "200px" }}>
                <h1>Inicia sessión</h1>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom:"1em" }}>
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" />
                    <Link href={`/password-reset-request`}>
                        <a>Recuperar contraseña</a>
                    </Link>
                </div>

                {errors && <p className="errors">{errors}</p>}
                <button type="submit">Enviar</button>
            </form>
        </Layout>
    )
}

LogIn.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(LogIn)
