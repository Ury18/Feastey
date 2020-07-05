import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import Layout from '../../../app/components/Layout'
import AttachmentsSection from '../../../app/components/AttachmentsSection'
import FileUploader from '../../../app/components/FileUploader'
import GoogleMap from '../../../app/components/GoogleMap'
import { updateUserData } from '../../../app/redux/user/action'

class EditBusiness extends Component {

    state = {
        id: "",
        name: "",
        description: "",
        location: {
            address: "",
            location: []
        },
        errors: "",
        images: [],
        attachments: [],
        tempFiles: [],
        deletedFiles: []
    }

    componentDidMount = () => {
        const { business } = this.props
        this.setState({ ...business })
        let location = {
            address: business.location.address,
            location: business.location.location.coordinates
        }
        this.setState({ location, address: location.address })
        window.addEventListener("beforeunload", this.onWindowClose)
    }

    onWindowClose = (e) => {
        const { tempFiles } = this.state
        const { id, token } = this.props.user

        let blob = new Blob(
            [JSON.stringify({ files: tempFiles, authToken: token })],
            {
                type: 'application/json; charset=UTF-8'
            }
        )

        navigator.sendBeacon('http://localhost:3000/api/files/delete-multiple', blob)
    }

    editBusiness = (e) => {
        e.preventDefault()

        const { id, name, description, location, images, attachments, deletedFiles } = this.state
        const { user } = this.props
        const { token } = user

        this.setState({ errors: "" })

        let imageList = []

        for (var i = 0; i < images.length; i++) {
            imageList.push(images[i].id)
        }

        let attachmentsClean = []

        for (var i = 0; i < attachments.length; i++) {
            let attachment = {}
            attachment.name = attachments[i].name

            let files = attachments[i].files
            let cleanFiles = []

            for (var j = 0; j < files.length; j++) {
                cleanFiles.push(files[j].id)
            }

            attachment.files = cleanFiles

            attachmentsClean.push(attachment)
        }

        let newLocation = {
            address: location.address,
            location: {
                type: "Point",
                coordinates: location.location
            }
        }

        let data = {
            name,
            description,
            location: newLocation,
            images: imageList,
            attachments: attachmentsClean,
            owner: user.id
        }

        fetch(`http://localhost:3000/api/business/${id}`, {
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
                    this.setState({ errors: "" })
                    window.removeEventListener("beforeunload", this.onWindowClose)

                    let blob = new Blob(
                        [JSON.stringify({ files: deletedFiles, authToken: token })],
                        {
                            type: 'application/json; charset=UTF-8'
                        }
                    )

                    navigator.sendBeacon('http://localhost:3000/api/files/delete-multiple', blob)


                    Router.push(`/business/${res.id}`)
                }
            })
            .catch(err => {
                this.setState({ errors: res.error })
            })
    }

    onUploadImage = (value) => {
        const { images } = this.state

        let newImages = images
        newImages.push(value)

        this.setState({ images: newImages })
    }
    onUpdateImage = (index, value) => {
        const { images } = this.state
        let newImages = images
        newImages[index] = value
        this.setState({ images: newImages })
    }

    onDeleteImage = (e, index) => {
        e.preventDefault()
        const { images, deletedFiles } = this.state
        deletedFiles.push(images[index].id)
        let newImages = images
        newImages.splice(index, 1)

        this.setState({ images: newImages, deletedFiles })
    }

    addNewTempFile = (value) => {
        const { tempFiles } = this.state

        let newTempFiles = tempFiles
        newTempFiles.push(value.id)

        this.setState({ tempFiles: newTempFiles })

    }

    onUploadAttachment = (value) => {
        const { attachments } = this.state
        let newAttachments = attachments
        newAttachments.push(value)
        this.setState({ attachments: newAttachments })
    }

    onUpdateAttachment = (index, value) => {
        const { attachments } = this.state
        let newAttachments = attachments
        newAttachments[index] = value
        this.setState({ attachments: newAttachments })
    }

    onDeleteAttachment = (value) => {
        const { deletedFiles } = this.state
        deletedFiles.push(value)

        this.setState({ deletedFiles })
    }

    renderImagesUploader = () => {
        const { images } = this.state
        const { onUpdateImage, onUploadImage, addNewTempFile, onDeleteImage } = this

        let newImages = []

        newImages = images.map((item, index) => {
            return <FileUploader key={index} index={index} updateCallback={onUpdateImage} uploadCallback={onUploadImage} tempFileCallback={addNewTempFile} data={item} deleteCallback={onDeleteImage} />
        })

        newImages.push(<FileUploader updateCallback={onUpdateImage} uploadCallback={onUploadImage} tempFileCallback={addNewTempFile} deleteCallback={onDeleteImage} />)
        return newImages
    }

    renderAttachmentsSection = () => {
        const { attachments } = this.state
        const { onUpdateAttachment, onUploadAttachment, addNewTempFile, onDeleteAttachment } = this

        let newAttachments = []

        newAttachments = attachments.map((item, index) => {
            return <AttachmentsSection key={index} index={index} updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} tempFileCallback={addNewTempFile} deleteCallback={onDeleteAttachment} data={item} />
        })

        newAttachments.push(<AttachmentsSection updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} tempFileCallback={addNewTempFile} deleteCallback={onDeleteAttachment} />)
        return newAttachments
    }

    onAcceptAddress = (e) => {
        const { location, address } = this.state

        e.preventDefault()

        fetch(`https://cors-anywhere.herokuapp.com/${process.env.GOOGLE_MAPS_GEOCODE_URL}address=${address}&key=${process.env.GOOGLE_MAPS_KEY}`, {
            headers: {
                "content-type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                location.address = address
                let geolocation = response.results[0].geometry.location
                location.location = [geolocation.lng, geolocation.lat]
                this.setState({ location })
            })
    }

    setInputValue = (name, value) => {
        if (name && value) {
            this.setState({ [name]: value })
        }
    }

    render() {
        const { name, description, location, address, errors } = this.state
        const { setInputValue, editBusiness, renderAttachmentsSection, renderImagesUploader, onAcceptAddress } = this
        return (
            <Layout contentClasses="centered">
                <form onSubmit={(e) => editBusiness(e)} style={{ maxWidth: "200px" }}>
                    <h1>Edit tu negocio</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={name} name="name" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Descripción</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={description} name="description" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Dirección</label>
                        <div>
                            <input onChange={(e) => setInputValue(e.target.name, e.target.value)} defaultValue={address} name="address" type="text" required />
                            {address && address !== location.address && <button onClick={(e) => onAcceptAddress(e)}>Aceptar</button>}
                        </div>
                    </div>
                    {location && location.location && location.location.length > 0 && <div className="map-container">
                        <GoogleMap class="map" lng={location.location[0]} lat={location.location[1]} />
                    </div>}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Imagenes</label>
                        {renderImagesUploader()}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h2>Attachments</h2>
                        {renderAttachmentsSection()}
                    </div>

                    {errors && <p className="errors">{errors}</p>}

                    <button type="submit">Send</button>
                </form>
            </Layout>
        )
    }

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
