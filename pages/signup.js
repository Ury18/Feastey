import Layout from '../app/components/Layout'
import { useState } from 'react'
import { parseCookies } from '../app/middleware/parseCookies'

const Signup =  (props) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const registerUser = (e, data) => {

        e.preventDefault()

        if (data.password == data.passwordConfirmation) {

            fetch('http://localhost:3000/api/users', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })

        } else {
            console.log("Missmatching password")
        }
    }

    return (
        <Layout {...props}>
            <form onSubmit={(e) => registerUser(e, { username, email, password, passwordConfirmation })} style={{ maxWidth: "200px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" name="text" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password Confirmation</label>
                    <input onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" name="passwordConfirmation" />
                </div>
                <button type="submit">Send</button>
            </form>
        </Layout>
    )
}

Signup.getInitialProps = async (ctx) => {
    return {}
}

export default Signup

