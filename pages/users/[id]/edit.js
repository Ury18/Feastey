import { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../app/components/Layout'
import GoogleMap from '../../../app/components/GoogleMap'
import { updateUserData } from '../../../app/redux/user/action'

class EditUser extends Component {

    state = {
        id: "",
        username: "",
        password: "",
        email: "",
        errors: "",
        region: "",
        page: ""
    }

    componentDidMount = () => {
        const { user, page } = this.props
        this.setState({ ...user })
        this.setState({ page })
    }

    editUser = (e) => {
        e.preventDefault()

        const { id, username, password, email } = this.state
        const { user } = this.props
        const { token } = user

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
                    this.setState({ ...res })
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

    render() {
        const { username, errors } = this.state
        const { setInputValue, editUser } = this
        return (
            <Layout contentClasses="centered">
                <form onSubmit={(e) => editUser(e)} style={{ maxWidth: "200px" }}>
                    <h1>Edit tu info</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={username} name="username" />
                    </div>
                    <button type="submit">Guardar</button>

                    {errors && <p className="errors">{errors}</p>}
                </form>
            </Layout>
        )
    }

}

EditUser.getInitialProps = async (ctx) => {
    const page = parseFloat(ctx.query.page) || ""
    return { page }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(EditUser)
