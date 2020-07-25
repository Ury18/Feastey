import Layout from '../../app/components/Layout'
import { useState, useEffect, Component } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../../app/redux/user/action'
import Router from 'next/router'
import FileUploader from '../../app/components/FileUploader'
import AttachmentsSection from '../../app/components/AttachmentsSection'
import GoogleMap from '../../app/components/GoogleMap'
//Rich Text
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentInfoForm from '../../app/components/PaymentInfoForm'

const stripePromise = loadStripe("pk_test_51H7jFNHesZkxfUDSfJkBztrwFiLv7BnMbzJdhbleX9haB2ncM4RUjfWOazBen7aK3yW3x2BzDd26Z2wOq4BVkuni00vFmhfisR");

class CreateBusiness extends Component {

    state = {
        name: "",
        description: "",
        address: "",
        summary: "",
        location: [],
        finalAddress: "",
        errors: "",
        images: [],
        attachments: [],
        deletedFiles: [],
        category: "",
        priceId: "",
        paymentMethodId: ""
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onWindowClose)
    }

    onWindowClose = (e) => {
        const { images, attachments, deletedFiles } = this.state
        const { token } = this.props.user
        let files = []

        for (var i = 0; i < images.length; i++) {
            files.push(images[i].id)
        }

        for (var i = 0; i < attachments.length; i++) {

            let thisFiles = attachments[i].files

            for (var j = 0; j < thisFiles.length; j++) {
                files.push(thisFiles[j].id)
            }
        }
        files = files.concat(deletedFiles)
        let blob = new Blob(
            [JSON.stringify({ files, authToken: token })],
            {
                type: 'application/json; charset=UTF-8'
            }
        )

        navigator.sendBeacon(`${process.env.FEASTEY_API_URL}/files/delete-multiple`, blob)
    }

    createBusiness = (e) => {
        e.preventDefault()

        const { name, description, location, images, attachments, deletedFiles, finalAddress, category, summary, priceId, paymentMethodId } = this.state
        const { id, token } = this.props.user

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
            type: "Point",
            coordinates: location
        }

        let data = {
            name,
            description,
            summary,
            address: finalAddress,
            location: newLocation,
            images: imageList,
            attachments: attachmentsClean,
            category,
            ownerEmail: this.props.user.email,
            priceId,
            paymentMethodId
        }

        this.setState({ errors: "" })

        data.owner = id;

        fetch(`${process.env.FEASTEY_API_URL}/business`, {
            method: "POST",
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
                    window.removeEventListener("beforeunload", this.onWindowClose)

                    let blob = new Blob(
                        [JSON.stringify({ files: deletedFiles, authToken: token })],
                        {
                            type: 'application/json; charset=UTF-8'
                        }
                    )

                    navigator.sendBeacon(`${process.env.FEASTEY_API_URL}/files/delete-multiple`, blob)

                    Router.push(`/business/${res.id}`)
                }
            })
            .catch(err => {
                this.setState({ errors: err.error })
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

    onAcceptAddress = (e) => {
        let { location, address, finalAddress } = this.state

        e.preventDefault()

        fetch(`https://cors-anywhere.herokuapp.com/${process.env.GOOGLE_MAPS_GEOCODE_URL}address=${address}&key=${process.env.GOOGLE_MAPS_KEY}`, {
            headers: {
                "content-type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                finalAddress = address
                let geolocation = response.results[0].geometry.location
                location = [geolocation.lng, geolocation.lat]
                this.setState({ location, finalAddress })
            })

    }

    onDescriptionChange = (descriptionRichText) => {
        let description = draftToHtml(convertToRaw(descriptionRichText.getCurrentContent()));
        description = description.replace(/(?:\r\n|\r|\n)/g, "<br>")
        this.setState({ description: description })
    }

    setInputValue = (name, value) => {
        if (name) {
            this.setState({ [name]: value })
        }
    }

    renderImagesUploader = () => {
        const { images } = this.state
        const { onUpdateImage, onUploadImage, onDeleteImage } = this

        let newImages = []

        newImages = images.map((item, index) => {
            return <FileUploader key={index} index={index} updateCallback={onUpdateImage} uploadCallback={onUploadImage} data={item} deleteCallback={onDeleteImage} />
        })

        newImages.push(<FileUploader updateCallback={onUpdateImage} uploadCallback={onUploadImage} deleteCallback={onDeleteImage} />)
        return newImages
    }

    renderAttachmentsSection = () => {
        const { attachments } = this.state
        const { onUpdateAttachment, onUploadAttachment, onDeleteAttachment } = this

        let newAttachments = []

        newAttachments = attachments.map((item, index) => {
            return <AttachmentsSection key={index} index={index} updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} data={item} deleteCallback={onDeleteAttachment} />
        })

        newAttachments.push(<AttachmentsSection key={attachments.length} index={attachments.length} updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} deleteCallback={onDeleteAttachment} />)
        return newAttachments
    }

    renderCategoriesOptions = () => {
        const { categories } = this.props

        return categories.map((item) => {
            return <option value={item.id}>{item.name}</option>
        })
    }

    toolbar = {
        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    }

    render() {
        const { user: { token, id } } = this.props
        const { location, errors, address, finalAddress, priceId } = this.state
        const { renderImagesUploader, setInputValue, createBusiness, renderAttachmentsSection, onAcceptAddress, renderCategoriesOptions, onDescriptionChange, toolbar } = this

        return (
            <Layout contentClasses="centered">
                <form onSubmit={(e) => createBusiness(e)} style={{ maxWidth: "200px" }}>
                    <h1>Crea tu negocio</h1>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="name" type="text" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Dirección</label>
                        <div>
                            <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="address" type="text" required />
                            {address && address !== finalAddress && <button onClick={(e) => onAcceptAddress(e)}>Aceptar</button>}
                        </div>
                    </div>
                        {location && location.length > 0 && <div className="map-container">
                            <GoogleMap class="map" lng={location[0]} lat={location[1]} />
                        </div>}
                    <div>
                        <label>Categoría</label>
                        <select name="category" onChange={(e) => setInputValue(e.target.name, e.target.value)}>
                            <option value={""}>Ninguna</option>
                            {renderCategoriesOptions()}
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Resumen</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="summary" type="text" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Descripción</label>
                        <div>
                            <Editor toolbar={toolbar} onEditorStateChange={onDescriptionChange} />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Imagenes</label>
                        {renderImagesUploader()}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h2>Attachments</h2>
                        {renderAttachmentsSection()}
                    </div>

                    <div className={`price ${priceId == "price_1H7jXCHesZkxfUDSo4o2xLrL" ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", "price_1H7jXCHesZkxfUDSo4o2xLrL")}>
                        ANUAL
                    </div>
                    <div className={`price ${priceId == "price_1H7jWPHesZkxfUDSN4V0r8b0" ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", "price_1H7jWPHesZkxfUDSN4V0r8b0")}>
                        MONTHLY
                    </div>


                    <Elements stripe={stripePromise}>
                        <PaymentInfoForm onSubmit={(paymentMethodId) => this.setState({ paymentMethodId})}/>
                    </Elements>

                    {errors && <p className="errors">{errors}</p>}

                    <button type="submit">Send</button>
                </form>
            </Layout>
        )
    }

}

CreateBusiness.getInitialProps = async (ctx) => {
    let categories = await fetch(`${process.env.FEASTEY_API_URL}/categories`)
    categories = await categories.json()
    return { categories }

}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(CreateBusiness)
