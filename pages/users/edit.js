import { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../app/components/Layout'
import { updateUserData } from '../../app/redux/user/action'
import Router from 'next/router'
import Head from 'next/head'
import '../../stylesheets/editUser.scss'

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

        fetch(`/api/users/${id}`, {
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
                    this.setState({ section: "info", errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "", username: "" })
                    window.location = "/users/edit"
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

        fetch(`/api/users/change-email`, {
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
                    this.setState({ section: "info", errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "", username: "" })
                    window.location = "/users/edit"
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

        fetch(`/api/users/change-password`, {
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
                    this.setState({ section: "info", errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "", username: "" })
                    window.location = "/users/edit"
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
        this.setState({ section: e.target.name, errors: "", password: "", newPassword: "", newPasswordConfirmation: "", email: "", username: "" })
        Router.replace(`/users/edit` + `?section=${e.target.name}`)
    }

    render() {
        const { errors, section } = this.state
        const { user } = this.props
        const { setInputValue, editUsername, setSection, editEmail, editPassword } = this
        return (
            <Layout contentClasses="background-gray" className="edit-user">
                <Head>
                    <title>Editar información - Feastey</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta property="og:title" content="Editar información - Feastey" key="title" />
                    <meta name="description" content="Pagina de visualizacion de información de usuario - Feastey" />
                    <meta property="og:type" content="website" />
                    <meta name="og:title" property="og:title" content="información de usuario - Feastey" />
                    <meta name="og:description" property="og:description" content="Pagina de visualizacion de información de usuario - Feastey" />
                    <meta property="og:site_name" content={`${process.env.HOST}`} />
                </Head>

                <div className="sections">
                    <a href="#" className={`section ${section == "info" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="info" onClick={e => setSection(e)}>Información</a>
                    <a href="#" className={`section ${section == "username" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="username" onClick={e => setSection(e)}>Cambiar nombre de usuario</a>
                    <a href="#" className={`section ${section == "email" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="email" onClick={e => setSection(e)}>Cambiar de dirección de correo</a>
                    <a href="#" className={`section ${section == "password" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="password" onClick={e => setSection(e)}>Cambiar Contraseña</a>
                </div>

                {section && section == "info" && <form>
                    <h2>Tu información</h2>
                    <div style={{textAlign: "left"}}>
                        <p><span>Nombre de usuario: </span> {user.username}</p>
                        <p><span>Dirección de correo: </span> {user.email}</p>
                    </div>
                </form>}
                {section && section == "username" && <form onSubmit={(e) => editUsername(e)} style={{ maxWidth: "200px" }}>
                    <h2>Cambiar Nombre</h2>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" name="username" />
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
                {section && section == "email" && <form onSubmit={(e) => editEmail(e)} style={{ maxWidth: "200px" }}>
                    <h2>Cambiar dirección de correo</h2>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="password" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nuevo Email</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="email" name="email" required />
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
                {section && section == "password" && <form onSubmit={(e) => editPassword(e)} style={{ maxWidth: "200px" }}>
                    <h2>Cambiar Contraseña</h2>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Contraseña Actual</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="password" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nueva Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="newPassword" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nueva Contraseña</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="password" name="newPasswordConfirmation" required />
                    </div>
                    <button type="submit">Guardar</button>
                    {errors && <p className="errors">{errors}</p>}
                </form>}
            </Layout>
        )
    }

}

export const getServerSideProps = async (ctx) => {
    const section = ctx.query.section || "info"
    return { props: {section} }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(EditUser)
