import Layout from '../app/components/Layout'
import Cookie from "js-cookie"
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'
import '../stylesheets/signupForm.scss'

const LogIn = (props) => {

    const router = useRouter()

    const { cookie, updateUserData } = props
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")

    const logIn = (e, data) => {
        e.preventDefault()

        fetch(`/api/users/authenticate`, {
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
                    Cookie.set("authToken", res.token, {expires: 1})
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
        <Layout contentClasses="centered background-gray">
            <Head>
                <title>Inicia seión - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Inicia seión - Feastey" key="title" />
                <meta name="description" content="Pagina de Inicia seión - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Inicia seión - Feastey" />
                <meta name="og:description" property="og:description" content="Pagina de Inicia seión - Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <form className="signup-form" onSubmit={(e) => logIn(e, { email, password })} style={{ maxWidth: "200px" }}>
                <h2>Inicia sessión</h2>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "1em" }}>
                    <label>Contraseña</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" />
                    <Link href={`/password-reset-request`}>
                        <a>Recuperar contraseña</a>
                    </Link>
                </div>

                {errors && <p className="errors">{errors}</p>}
                <button type="submit">Iniciar Sesión</button>

                <p className="alt-message">
                    ¿No tienes cuenta? <br />
                    <Link href="/signup">
                        <a>
                            <strong>Regístrate</strong>
                        </a>
                    </Link>
                </p>

            </form>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(LogIn)
