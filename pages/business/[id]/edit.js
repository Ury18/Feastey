import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import Layout from '../../../app/components/Layout'
import AttachmentsSection from '../../../app/components/AttachmentsSection'
import FileUploader from '../../../app/components/FileUploader'
import GoogleMap from '../../../app/components/GoogleMap'
import { updateUserData } from '../../../app/redux/user/action'
//Rich Text
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs';
import { parseCookies } from '../../../app/middleware/parseCookies'

import PaymentInfoForm from '../../../app/components/PaymentInfoForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe("pk_test_51H7jFNHesZkxfUDSfJkBztrwFiLv7BnMbzJdhbleX9haB2ncM4RUjfWOazBen7aK3yW3x2BzDd26Z2wOq4BVkuni00vFmhfisR");
import Head from 'next/head'

class EditBusiness extends Component {

    state = {
        id: "",
        name: "",
        description: "",
        isPublished: false,
        address: "",
        summary: "",
        location: [],
        finalAddress: "",
        errors: "",
        images: [],
        mainImage: "",
        attachments: [],
        tempFiles: [],
        deletedFiles: [],
        category: "",
        descriptionEditorState: {},
        priceId: "",
        paymentMethodId: "",
        last4: "",
        instagram: "",
        twitter:"",
        phone:"",
        email: "",
    }

    componentDidMount = () => {


        const { business, user } = this.props

        if (user.id !== business.owner) {
            Router.push("/")
        } else {
            this.setState({ ...business })
            let location = business.location.coordinates
            this.setState({ location, finalAddress: business.address })
            this.setState({
                priceId: business.stripe.priceId,
                paymentMethodId: business.stripe.paymentMethodId,
                last4: business.stripe.last4,
                stripe: {}
            })

            if(business.info) {
                this.setState({...business.info})
            }


            this.onDescriptionExists()
            window.addEventListener("beforeunload", this.onWindowClose)
        }
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

        navigator.sendBeacon(`${process.env.FEASTEY_API_URL}/files/delete-multiple`, blob)
    }

    editBusiness = (e) => {
        e.preventDefault()

        const { id, name, description, location,
            images, attachments, deletedFiles, finalAddress,
            category, summary, priceId, paymentMethodId, mainImage,
            twitter, instagram, email, phone } = this.state
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
            owner: user.id,
            category: category.id,
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

        fetch(`${process.env.FEASTEY_API_URL}/business/${id}`, {
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

    renderMainImageUploader = () => {
        const { onUpdateMainImage, onUploadMainImage, onDeleteMainImage, addNewTempFile } = this
        const { mainImage } = this.state
        return <FileUploader data={mainImage} updateCallback={onUpdateMainImage} uploadCallback={onUploadMainImage} tempFileCallback={addNewTempFile} deleteCallback={onDeleteMainImage} />
    }

    renderMainImageUploaderEmpty = () => {
        const { onUpdateMainImage, onUploadMainImage, onDeleteMainImage, addNewTempFile } = this
        return <FileUploader updateCallback={onUpdateMainImage} uploadCallback={onUploadMainImage} tempFileCallback={addNewTempFile} deleteCallback={onDeleteMainImage} />
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

    setInputValue = (name, value) => {
        if (name) {
            this.setState({ [name]: value })
        }
    }

    renderCategoriesOptions = () => {
        const { categories } = this.props
        const { category } = this.state

        return categories.map((item) => {
            let selected = false
            if (item.id == category.id) {
                selected = true
            }
            return <option selected={selected} value={item.id}>{item.name}</option>
        })
    }

    onDescriptionChange = (descriptionRichText) => {
        let description = draftToHtml(convertToRaw(descriptionRichText.getCurrentContent()));
        description = description.replace(/(?:\r\n|\r|\n)/g, "<br>")
        this.setState({ description: description })
    }

    onDescriptionExists = () => {
        const { description } = this.props.business
        const blocksFromHTML = htmlToDraft(description)
        const content = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        )
        const descriptionToDraft = EditorState.createWithContent(content)
        this.setState({ descriptionEditorState: descriptionToDraft })
    }

    toolbar = {
        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    }

    render() {
        const { business } = this.props

        const {
            name, description, location, address, errors, finalAddress,
            category, summary, descriptionEditorState, priceId, isPublished,
            last4, mainImage, twitter, instagram, email, phone
        } = this.state

        const {
            setInputValue, editBusiness, renderAttachmentsSection,
            renderImagesUploader, onAcceptAddress,
            renderCategoriesOptions, onDescriptionChange, toolbar,
            renderMainImageUploader, renderMainImageUploaderEmpty
        } = this

        return (
            <Layout contentClasses="centered">
                <Head>
                    <title>{`Editando ${business.name} - Feastey`}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta property="og:title" content={`Editando ${business.name} - Feastey`} key="title" />
                    <meta name="description" content={`Pagina de edición de ${business.name} - Feastey`} />
                    <meta property="og:type" content="website" />
                    <meta name="og:title" property="og:title" content={`Editando ${business.name} - Feastey`} />
                    <meta name="og:description" property="og:description" content={`Pagina de edición de ${business.name} - Feastey`} />
                    <meta property="og:site_name" content="ury.feastey.com" />
                </Head>
                <form onSubmit={(e) => editBusiness(e)} style={{ maxWidth: "200px" }}>
                    <h1>Edit tu negocio</h1>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Publicado</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.checked)} type="checkbox" checked={isPublished} name="isPublished" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={name} name="name" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Email</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="email" defaultValue={email} type="email"  />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Telefono</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="phone" defaultValue={phone} type="tel"  />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Twitter</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="twitter" defaultValue={twitter} type="text"  />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Instagram</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="instagram" defaultValue={instagram} type="text"  />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Dirección</label>
                        <div>
                            <input onChange={(e) => setInputValue(e.target.name, e.target.value)} defaultValue={address} name="address" type="text" required />
                            {address && address !== finalAddress && <button onClick={(e) => onAcceptAddress(e)}>Aceptar</button>}
                        </div>
                    </div>
                    {location && location.length > 0 && <div className="map-container">
                        <GoogleMap class="map" lng={location[0]} lat={location[1]} />
                    </div>}
                    <div>
                        <label>Categoría</label>
                        <select name="category" defaultValue={category.id} onChange={(e) => setInputValue(e.target.name, e.target.value)}>
                            <option value={""}>Ninguna</option>
                            {renderCategoriesOptions()}
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Resumen</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={summary} name="summary" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Descripción</label>
                        <div>
                            {/* <Editor/> */}
                            {descriptionEditorState && <Editor toolbar={toolbar} defaultEditorState={descriptionEditorState} onEditorStateChange={onDescriptionChange} />}
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: description }}></div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Imagen de perfil</label>
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

                    <div className={`price ${priceId == "price_1H7jXCHesZkxfUDSo4o2xLrL" ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", "price_1H7jXCHesZkxfUDSo4o2xLrL")}>
                        ANUAL
                    </div>
                    <div className={`price ${priceId == "price_1H7jWPHesZkxfUDSN4V0r8b0" ? " selected" : ""}`} onClick={(e) => setInputValue("priceId", "price_1H7jWPHesZkxfUDSN4V0r8b0")}>
                        MONTHLY
                    </div>
                    {last4}
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

EditBusiness.getInitialProps = async (ctx) => {
    const cookie = parseCookies(ctx.req)
    const res = await fetch(`${process.env.FEASTEY_API_URL}/business/${ctx.query.id}`,
        {
            headers: {
                authorization: `Bearer ${cookie.authToken}`
            }
        })
    const business = await res.json()
    let categories = await fetch(`${process.env.FEASTEY_API_URL}/categories`)
    categories = await categories.json()
    return { business, categories }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(EditBusiness)
