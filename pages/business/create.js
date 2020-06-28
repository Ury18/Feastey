import Layout from '../../app/components/Layout'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../../app/redux/user/action'
import { useRouter } from 'next/router'
import FileUploader from '../../app/components/FileUploader'

const CreateBusiness = (props) => {

    const router = useRouter()
    const { user: { token, id } } = props

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [errors, setErrors] = useState("")
    const [images, setImages] = useState("")

    const createBusiness = (e, data) => {
        e.preventDefault()

        setErrors("")
        data.owner = id;

        fetch('http://localhost:3000/api/business', {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization" : `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setErrors(res.error)
                } else {
                    router.push(`/business/${res.id}`)
                }
            })
            .catch(err => {
                setErrors(err.error)
            })
    }

    const renderImagesUploader = () => {
        let imagesCards = images.map(image => {
            <FileUploader />
        })
    }

    return (
        <Layout contentClasses="centered">
            <form onSubmit={(e) => createBusiness(e, { name, description, location })} style={{ maxWidth: "200px" }}>
                <h1>Crea tu negocio</h1>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Nombre</label>
                    <input onChange={(e) => setName(e.target.value)} type="text" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Descripción</label>
                    <input onChange={(e) => setDescription(e.target.value)} type="text" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Dirección</label>
                    <input onChange={(e) => setLocation(e.target.value)} type="text" />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Imagenes</label>
                   <FileUploader/>
                </div>


                {errors && <p className="errors">{errors}</p>}

                <button type="submit">Send</button>
            </form>
        </Layout>
    )
}

CreateBusiness.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(CreateBusiness)
