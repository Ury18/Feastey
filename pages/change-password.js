import Layout from '../app/components/Layout'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'
import Cookie from "js-cookie"

const ResetPassword = (props) => {
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [errors, setErrors] = useState("")

    useEffect(() => {
        if (props.user.id) {
            router.push("/")
        }
    }, [])

    const onSubmitForm = (e) => {
        e.preventDefault()
        fetch(`${process.env.FEASTEY_API_URL}/users/change-password`, {
            method: "PUT",
            headers: {
                "authorization": `Bearer ${props.auth}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ newPassword: password, newPasswordConfirmation: passwordConfirmation, encpass: props.encpass })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.error) setErrors(res.error)

                else {
                    router.push("/login")
                }
            })
            .catch(err => {
                setErrors(err.error)
            })
    }

    return (
        <Layout contentClasses="centered">
            {!emailSent && <form onSubmit={(e) => onSubmitForm(e)}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password Confirmation</label>
                    <input onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" />
                </div>
                {errors && <p className="errors">{errors}</p>}
                <button type="submit">Enviar</button>
            </form>}

        </Layout>
    )
}

ResetPassword.getInitialProps = async (ctx) => {
    const auth = ctx.query.auth || ""
    const encpass = ctx.query.encpass || ""
    return { encpass, auth }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(ResetPassword)
