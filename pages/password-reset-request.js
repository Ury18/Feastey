import Layout from '../app/components/Layout'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { useRouter } from 'next/router'

const ResetPasswordRequest = (props) => {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)

    useEffect(() => {
        if (props.user.id) {
            router.push("/")
        }
    }, [])

    const onSubmitForm = (e) => {
        e.preventDefault()
        fetch(`${process.env.FEASTEY_API_URL}/users/change-pass-request`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({email})
        })
        setEmailSent(true)
    }

    return (
        <Layout contentClasses="centered">
            {!emailSent && <form onSubmit={(e) => onSubmitForm(e)}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
                </div>
                <button type="submit">Enviar</button>
            </form>}
            {emailSent && <div>
                <p>Hemos enviado un mensaje a tu dirección con los pasos para reestablecer tu constraseña</p>
            </div>}

        </Layout>
    )
}

ResetPasswordRequest.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(ResetPasswordRequest)
