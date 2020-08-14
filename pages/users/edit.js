import { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../app/components/Layout'
import { updateUserData } from '../../app/redux/user/action'
import Router from 'next/router'
import Head from 'next/head'

class EditUser extends Component {

    state = {
        username: "",
        password: "",
        newPassword: "",
        newPasswordConfirmation: "",
        email: "",
        errors: "",
        section: ""
    }

    componentDidMount = () => {
        const { user, section } = this.props
        this.setState({ username: user.username })
        this.setState({ section })
    }

    editUsername = (e) => {
        e.preventDefault()

        const { username } = this.state
        const { user } = this.props
        const { token, id } = user

        this.setState({ errors: "" })

        let data = {
            username
        }

        fetch(`${process.env.FEASTEY_API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    this.setState({ errors: res.error })
                } else {
                    Router.push(Router.asPath)
                }
            })
            .catch(err => {
                this.setState({ errors: err.error })
            })
    }

    editEmail = (e) => {
        e.preventDefault()

        const { password, email } = this.state
        const { user } = this.props
        const { token } = user

        this.setState({ errors: "" })

        let data = {
            password,
            email
        }

        fetch(`${process.env.FEASTEY_API_URL}/users/change-email`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    this.setState({ errors: res.error })
                } else {
                    this.setState({ section: "", errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "" })
                    Router.replace(`/users/edit`)
                    updateUserData(res)
                }
            })
            .catch(err => {
                this.setState({ errors: err.error })
            })
    }

    editPassword = (e) => {
        e.preventDefault()

        const { password, newPassword, newPasswordConfirmation } = this.state
        const { user } = this.props
        const { token } = user

        this.setState({ errors: "" })

        let data = {
            password,
            newPassword,
            newPasswordConfirmation
        }

        fetch(`${process.env.FEASTEY_API_URL}/users/change-password`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    this.setState({ errors: res.error })
                } else {
                    this.setState({ section: "", errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "" })
                    Router.replace(`/users/edit`)
                    updateUserData(res)
                }
            })
            .catch(err => {
                this.setState({ errors: err.error })
            })
    }

    setInputValue = (name, value) => {
        if (name) {
            this.setState({ [name]: value })
        }
    }

    setSection = (e) => {
        e.preventDefault()
        this.setState({ section: e.target.name, errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "" })
        Router.replace(`/users/edit` + `?section=${e.target.name}`)
    }

    render() {
        const { username, errors, section } = this.state
        const { setInputValue, editUsername, setSection, editEmail, editPassword } = this
        return (
            <Layout contentClasses="centered">
                <Head>
                    <title>Editar información - Feastey</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta property="og:title" content="Editar información - Feastey" key="title" />
                    <meta name="description" content="Pagina de visualizacion de información de usuario - Feastey" />
                    <meta property="og:type" content="website" />
                    <meta name="og:title" property="og:title" content="información de usuario - Feastey" />
                    <meta name="og:description" property="og:description" content="Pagina de visualizacion de información de usuario - Feastey" />
                    <meta property="og:site_name" content="ury.feastey.com" />
                </Head>
                {!section && <form onSubmit={(e) => editUsername(e)} style={{ maxWidth: "200px" }}>
                    <h1>Change username</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={username} name="username" />
                        <a style={{ cursor: "pointer" }} name="email" onClick={e => setSection(e)}>Cambiar Email</a>
                        <a style={{ cursor: "pointer" }} name="password" onClick={e => setSection(e)}>Cambiar Contraseña</a>
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
                {section && section == "email" && <form onSubmit={(e) => editEmail(e)} style={{ maxWidth: "200px" }}>
                    <h1>Change email</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="password" required/>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nuevo Email</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="email" name="email" required/>
                        <a style={{ cursor: "pointer" }} name="" onClick={e => setSection(e)}>volver</a>
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
                {section && section == "password" && <form onSubmit={(e) => editPassword(e)} style={{ maxWidth: "200px" }}>
                    <h1>Change pass</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Contraseña Actual</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="password" required/>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nueva Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="newPassword" required/>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nueva Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="newPasswordConfirmation" required/>
                        <a style={{ cursor: "pointer" }} name="" onClick={e => setSection(e)}>volver</a>
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
            </Layout>
        )
    }

}

EditUser.getInitialProps = async (ctx) => {
    const section = ctx.query.section || ""
    return { section }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(EditUser)
