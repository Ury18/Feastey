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
import Head from 'next/head'

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

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
        mainImage: "",
        attachments: [],
        deletedFiles: [],
        category: "",
        priceId: "",
        paymentMethodId: "",
        email: "",
        phone: "",
        twitter: "",
        instagram: ""
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onWindowClose)
    }

    onWindowClose = (e) => {
        const { images, attachments, deletedFiles, mainImage } = this.state
        const { token } = this.props.user
        let files = []

        for (var i = 0; i < images.length; i++) {
            files.push(images[i].id)
        }

        files.push(mainImage.id)

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

        const { name, description, location, images, attachments,
            deletedFiles, finalAddress, category, summary,
            priceId, paymentMethodId, mainImage, email, phone, twitter, instagram } = this.state

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
            paymentMethodId,
            info: {
                email,
                phone,
                twitter,
                instagram,
            }
        }

        if (mainImage) data.mainImage = mainImage.id


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

    onUploadMainImage = (value) => {
        this.setState({ mainImage: value })
    }

    onUpdateMainImage = (index, value) => {
        this.setState({ mainImage: value })
    }

    onDeleteMainImage = (e) => {
        e.preventDefault()

        const { mainImage, deletedFiles } = this.state

        deletedFiles.push(mainImage.id)

        this.setState({ mainImage: null, deletedFiles })
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

    renderMainImageUploaderEmpty = () => {
        const { onUpdateMainImage, onUploadMainImage, onDeleteMainImage } = this
        return <FileUploader updateCallback={onUpdateMainImage} uploadCallback={onUploadMainImage} deleteCallback={onDeleteMainImage} />
    }

    renderMainImageUploader = () => {
        const { onUpdateMainImage, onUploadMainImage, onDeleteMainImage } = this
        const { mainImage } = this.state
        return <FileUploader data={mainImage} updateCallback={onUpdateMainImage} uploadCallback={onUploadMainImage} deleteCallback={onDeleteMainImage} />
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
        const { location, errors, address, finalAddress, priceId, mainImage } = this.state
        const { renderImagesUploader, setInputValue, createBusiness, renderAttachmentsSection, renderMainImageUploader, renderMainImageUploaderEmpty, onAcceptAddress, renderCategoriesOptions, onDescriptionChange, toolbar } = this

        return (
            <Layout contentClasses="centered">
                <Head>
                    <title>Publica tu negocio! - Feastey</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta property="og:title" content="Publica tu negocio! - Feastey" key="title" />
                    <meta name="description" content="Publica tu negocio ya en Feastey y aprovecha todas sus ventajas! - Feastey" />
                    <meta property="og:type" content="website" />
                    <meta name="og:title" property="og:title" content="Publica tu negocio! - Feastey" />
                    <meta name="og:description" property="og:description" content="Publica tu negocio ya en Feastey y aprovecha todas sus ventajas! - Feastey" />
                    <meta property="og:site_name" content="ury.feastey.com" />
                </Head>
                <form onSubmit={(e) => createBusiness(e)} style={{ maxWidth: "200px" }}>
                    <h1>Crea tu negocio</h1>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="name" type="text" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Email</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="email" type="email" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Telefono</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="phone" type="tel" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Twitter</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="twitter" type="text" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Instagram</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="instagram" type="text" />
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
                        <div className="richtext">
                            <Editor toolbar={toolbar} onEditorStateChange={onDescriptionChange} />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Imagen principal</label>
                        {mainImage && renderMainImageUploader()}
                        {!mainImage && renderMainImageUploaderEmpty()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Imagenes</label>
                        {renderImagesUploader()}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h2>Attachments</h2>
                        {renderAttachmentsSection()}
                    </div>

                    <div className={`price ${priceId == process.env.STRIPE_PRICE_ANUAL ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", process.env.STRIPE_PRICE_ANUAL)}>
                        ANUAL
                    </div>
                    <div className={`price ${priceId == process.env.STRIPE_PRICE_MONTHLY ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", process.env.STRIPE_PRICE_MONTHLY)}>
                        MONTHLY
                    </div>


                    <Elements stripe={stripePromise}>
                        <PaymentInfoForm onSubmit={(paymentMethodId) => this.setState({ paymentMethodId })} />
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
