import Layout from '../app/components/Layout'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import '../stylesheets/signupForm.scss'

const Signup = (props) => {

    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errors, setErrors] = useState("")
    const [role, setRole] = useState("businessOwner")
    const [policyAccepted, setPolicyAccepted] = useState(false)

    const registerUser = (e, data) => {

        e.preventDefault()

        if (data.password == data.passwordConfirmation) {
            setErrors("")

            fetch(`/api/users`, {
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
                        router.push('/please-verify-user')
                    }
                })
                .catch(err => {
                    setErrors(err.error)
                })

        } else {
            setErrors("Las contraseñas no coinciden")
        }
    }

    return (
        <Layout contentClasses="centered background-gray">
            <Head>
                <title>Registrate ya! - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Registrate ya! - Feastey" key="title" />
                <meta name="description" content="No esperes mas y registrate ya en feastey.com! Pagina de registro - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Registrate ya! - Feastey" />
                <meta name="og:description" property="og:description" content="No esperes mas y registrate ya en feastey.com! Pagina de registro - Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <form className="signup-form" onSubmit={(e) => registerUser(e, { username, email, password, passwordConfirmation, role })} style={{ maxWidth: "200px" }}>
                <h2>Crea tu cuenta</h2>
                {/* <div className="roles">
                    <p className={`${role == "user" ? "selected" : ""}`} onClick={e => setRole("user")}>Usuario</p>
                    <p className={`${role == "businessOwner" ? "selected" : ""}`} onClick={e => setRole("businessOwner")}>Profesional</p>
                </div> */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Nombre</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="text" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Contraseña</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Confirmación de la Contraseña</label>
                    <input onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" name="passwordConfirmation" required />
                </div>

                <div className="policies">
                    <input onChange={(e) => setPolicyAccepted(e.target.checked)} type="checkbox" name="policyAccepted" required={true} />
                    <p>He leido y acepto la
                        <Link href="/privacy-policy">
                            <a>
                                <strong> Política de Privacidad </strong>
                            </a>
                        </Link>
                        y los <Link href="/terms-and-conditions">
                            <a>
                                <strong > Términos y Condiciones</strong>
                            </a>
                        </Link>
                    </p>
                </div>

                {errors && <p className="errors">{errors}</p>}

                <button type="submit">Enviar</button>

                <p className="alt-message">
                    ¿Ya tienes cuenta? <br />
                    <Link href="/login">
                        <a>
                            <strong>Inicia Sesión</strong>
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
export default connect((state => state), mapDispatchToProps)(Signup)
