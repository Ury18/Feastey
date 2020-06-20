import Layout from '../../../app/components/Layout'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../../../app/redux/user/action'
import { useRouter } from 'next/router'

const EditBusiness = (props) => {

    const router = useRouter()
    const { user: { token }, business, user } = props

    const [name, setName] = useState(business.name)
    const [description, setDescription] = useState(business.description)
    const [location, setLocation] = useState(business.location)
    const [errors, setErrors] = useState("")

    const editBusiness = (e, data) => {

        e.preventDefault()
        setErrors("")

        data.owner = user.id;

        fetch(`http://localhost:3000/api/business/${business.id}`, {
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
                    setErrors(res.error)
                } else {
                    setErrors("")
                    router.push(`/business/${res.id}`)
                }
            })
            .catch(err => {
                setErrors(err.error)
            })
    }

    return (
        <Layout contentClasses="centered">
            <form onSubmit={(e) => editBusiness(e, { name, description, location })} style={{ maxWidth: "200px" }}>
                <h1>Edit tu negocio</h1>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Nombre</label>
                    <input onChange={(e) => setName(e.target.value)} type="text" value={name}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Descripción</label>
                    <input onChange={(e) => setDescription(e.target.value)} type="text" value={description}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Dirección</label>
                    <input onChange={(e) => setLocation(e.target.value)} type="text" value={location}/>
                </div>

                {errors && <p className="errors">{errors}</p>}

                <button type="submit">Send</button>
            </form>
        </Layout>
    )
}

EditBusiness.getInitialProps = async (ctx) => {
    const res = await fetch(`http://localhost:3000/api/business/${ctx.query.id}`)
    const business = await res.json()
    return { business }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(EditBusiness)
