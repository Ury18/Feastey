import Layout from '../app/components/Layout'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'

const SignupBusiness = (props) => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errors, setErrors] = useState("")
    const role ="businessOwner"

    const registerUser = (e, data) => {

        e.preventDefault()

        if (data.password == data.passwordConfirmation) {
            setErrors("")

            fetch('http://localhost:3000/api/users', {
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
                        setErrors("")
                        console.log(res)
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
        <Layout contentClasses="centered">
            <form onSubmit={(e) => registerUser(e, { username, email, password, passwordConfirmation, role })} style={{ maxWidth: "200px" }}>
                <h1>Crea tu cuenta de profesional</h1>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="text" required />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" required/>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" required/>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password Confirmation</label>
                    <input onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" name="passwordConfirmation" required/>
                </div>

                {errors && <p className="errors">{errors}</p>}

                <button type="submit">Send</button>
            </form>
        </Layout>
    )
}

SignupBusiness.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(SignupBusiness)
