import { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import Layout from '../../../app/components/Layout'
import AttachmentsSection from '../../../app/components/AttachmentsSection'
import FileUploader from '../../../app/components/FileUploader'
import GoogleMap from '../../../app/components/GoogleMap'
import { updateUserData } from '../../../app/redux/user/action'
import Head from 'next/head'
import { parseCookies } from '../../../app/middleware/parseCookies'

//Rich Text
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs';

//Stripe
import PaymentInfoForm from '../../../app/components/PaymentInfoForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

import '../../../stylesheets/editBusinessPage.scss'

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
        qr_codes: [],
        attachments: [],
        tempFiles: [],
        deletedFiles: [],
        category: "",
        descriptionEditorState: {},
        subscriptionPlan: "",
        oldSubscriptionPlan: "",
        paymentMethodId: null,
        last4: "",
        instagram: "",
        twitter: "",
        phone: "",
        whatsapp: "",
        email: "",
        busy: false,
        section: "",
        qrsLanguage: ""
    }

    componentDidMount = () => {
        const { business, user, section } = this.props

        if (user.id !== business.owner) {
            if (user.id) {
                Router.push("/")
            } else {
                Router.push("/login")
            }
        } else {
            this.setState({ ...business })
            let location = business.location.coordinates
            let newState = {
                location,
                finalAddress: business.address,
                oldSubscriptionPlan: business.subscriptionPlan,
                stripe: {},
                section
            }

            if (business.stripe.paymentMethodId) {
                newState.paymentMethodId = business.stripe.paymentMethodId
                newState.last4 = business.stripe.last4
            }

            if (business.info) {
                this.setState({ ...business.info })
            }

            this.setState(newState)

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
            category, summary, mainImage,
            twitter, instagram, email, phone, whatsapp } = this.state
        const { user } = this.props
        const { token } = user

        this.setState({ errors: "", busy: true })

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
            info: {
                email,
                phone,
                twitter,
                instagram,
                whatsapp
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
                    this.setState({ errors: res.error, busy: false })
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

    editPaymentsInfo = (e) => {
        e.preventDefault()
        const { subscriptionPlan, paymentMethodId, id } = this.state
        const { user } = this.props
        const { token } = user

        this.setState({ errors: "", busy: true })

        let data = {
            subscriptionPlan,
            paymentMethodId,
        }

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
                    this.setState({ errors: res.error, busy: false })
                } else {
                    this.setState({ errors: "" })
                    Router.push(`/business/${res.id}`)
                }
            })
            .catch(err => {
                this.setState({ errors: err.error })
            })
    }

    generateQrs = (e) => {
        e.preventDefault()
        const { id, qrsLanguage } = this.state
        const { user: { token } } = this.props

        this.setState({ errors: "", busy: true })

        let data = {
            lang: qrsLanguage,
            businessId: id
        }

        fetch(`${process.env.FEASTEY_API_URL}/business/generate-qrs`, {
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
                    this.setState({ errors: res.error, busy: false })
                } else {
                    setTimeout(() => {
                        this.setState({ errors: "", qr_codes: res.qr_codes, busy: false })
                    }, 800)
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

    renderPlanWarning = () => {
        const { oldSubscriptionPlan, subscriptionPlan } = this.state

        //Premium
        if (oldSubscriptionPlan == "premium") {
            if (oldSubscriptionPlan !== subscriptionPlan) {
                return <p className="price-change-warning"><span>¡Cuidado!</span> <br />Cambiar a un plan inferior eliminará automaticamente
                los archivos e imagenes que excedan el limite del plan selecionado.<br />
                    <span>Recomendamos tener copias de seguridad antes de cambiar de plan.</span>
                </p>
            }
        }

        //Plus
        if (oldSubscriptionPlan == "plus") {
            if (oldSubscriptionPlan !== subscriptionPlan && subscriptionPlan !== "premium")
                return <p className="price-change-warning"><span>¡Cuidado!</span> <br />Cambiar a un plan inferior eliminará automaticamente
                los archivos e imagenes que excedan el limite del plan selecionado.<br />
                    <span>Recomendamos tener copias de seguridad antes de cambiar de plan.</span>
                </p>
        }
    }

    setSection = (e) => {
        e.preventDefault()
        this.setState({ section: e.target.name, errors: "" })
        Router.replace('/business/[id]/edit', `/business/${this.state.id}/edit` + `?section=${e.target.name}`)
    }

    renderQrs = () => {
        const { qr_codes } = this.state

        return qr_codes.map(element => {
            return <div className="qr-section-container">
                <label>{element.language}</label>
                <div>
                    {element.files.map(file => {
                        return <img src={file.url} />
                    })}
                </div>
            </div>
        })
    }

    toolbar = {
        options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    }

    render() {
        const { business, user } = this.props

        const {
            name, location, address, errors, finalAddress,
            category, summary, descriptionEditorState, subscriptionPlan,
            last4, mainImage, twitter, instagram, email, phone, whatsapp, busy, section, qr_codes
        } = this.state

        const {
            setInputValue, editBusiness, renderAttachmentsSection,
            renderImagesUploader, onAcceptAddress,
            renderCategoriesOptions, onDescriptionChange, toolbar,
            renderMainImageUploader, renderMainImageUploaderEmpty,
            renderPlanWarning, setSection, editPaymentsInfo, generateQrs, renderQrs
        } = this

        return (
            <Layout contentClasses="background-gray">
                <Head>
                    <title>{`Editando ${business.name} - Feastey`}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta property="og:title" content={`Editando ${business.name} - Feastey`} key="title" />
                    <meta name="description" content={`Pagina de edición de ${business.name} - Feastey`} />
                    <meta property="og:type" content="website" />
                    <meta name="og:title" property="og:title" content={`Editando ${business.name} - Feastey`} />
                    <meta name="og:description" property="og:description" content={`Pagina de edición de ${business.name} - Feastey`} />
                    <meta property="og:site_name" content={`${process.env.HOST}`} />
                </Head>
                {user.id == business.owner && <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="sections">
                        <a href="#" className={`section ${section == "business" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="business" onClick={e => setSection(e)}>Negocio</a>
                        <a href="#" className={`section ${section == "payment" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="payment" onClick={e => setSection(e)}>Información de pago y suscripción</a>
                        <a href="#" className={`section ${section == "qrs" ? "selected" : ""}`} style={{ cursor: "pointer" }} name="qrs" onClick={e => setSection(e)}>Codigos QR</a>
                    </div>

                    {busy && <div className="busy" />}
                    {(section == "business" || section == "") &&
                        <form onSubmit={(e) => editBusiness(e)}>
                            <h1 style={{ textAlign: "center" }}>{`Editando ${business.name}`}</h1>
                            {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4em", width: "50%" }}>
                        <label>Publicado</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.checked)} type="checkbox" checked={isPublished} name="isPublished" />
                    </div> */}
                            <div className="info-field">
                                <label>Nombre</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={name} name="name" />
                            </div>
                            <div className="info-field">
                                <label>Email</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="email" defaultValue={email} type="email" />
                            </div>
                            <div className="info-field">
                                <label>Telefono</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="phone" defaultValue={phone} type="tel" />
                            </div>
                            <div className="info-field">
                                <label>WhatsApp</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="whatsapp" defaultValue={whatsapp} type="tel" />
                            </div>
                            <div className="info-field">
                                <label>Twitter</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="twitter" defaultValue={twitter} type="text" />
                            </div>
                            <div className="info-field">
                                <label>Instagram</label>
                                <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="instagram" defaultValue={instagram} type="text" />
                            </div>
                            <div className="info-field">
                                <label>Resumen</label>
                                <textarea onChange={(e) => setInputValue(e.target.name, e.target.value)} type="text" defaultValue={summary} name="summary" />
                            </div>
                            <div className="info-field">
                                <label>Categoría</label>
                                <select name="category" defaultValue={category.id} onChange={(e) => setInputValue(e.target.name, e.target.value)}>
                                    <option value={""}>Ninguna</option>
                                    {renderCategoriesOptions()}
                                </select>
                            </div>
                            <div className="address-container info-field">
                                <label>Dirección</label>
                                <div>
                                    <input onChange={(e) => setInputValue(e.target.name, e.target.value)} defaultValue={address} name="address" type="text" required />
                                    {address && address !== finalAddress && <i className="fas fa-check" onClick={(e) => onAcceptAddress(e)} />}
                                </div>
                            </div>
                            {location && location.length > 0 && <div className="map-container">
                                <GoogleMap class="map" lng={location[0]} lat={location[1]} />
                            </div>}
                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "2.4em" }}>
                                <label >Descripción</label>
                                <div className="richtext">
                                    {descriptionEditorState && <Editor toolbar={toolbar} defaultEditorState={descriptionEditorState} onEditorStateChange={onDescriptionChange} />}
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "2.4em" }}>
                                <label>Imagen de perfil</label>
                                {mainImage && renderMainImageUploader()}
                                {!mainImage && renderMainImageUploaderEmpty()}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "2.4em" }}>
                                <label>Imagenes</label>
                                {renderImagesUploader()}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h2 style={{ marginBottom: "1em", marginTop: "2em" }}>Secciones de archivos</h2>
                                {renderAttachmentsSection()}
                            </div>

                            {errors && <p className="errors">{errors}</p>}

                            <button type="submit">Send</button>
                        </form>
                    }
                    {section == "payment" &&
                        <form onSubmit={(e) => editPaymentsInfo(e)}>
                            <h2 style={{ marginBottom: ".5em" }}>Tu plan</h2>
                            <div className="priceList">
                                <div className={`price ${subscriptionPlan == "free" ? " selected" : ""}`} onClick={(e) => setInputValue("subscriptionPlan", "free")}>
                                    <h3>Free</h3>
                                    <p>20 Imagenes</p>
                                    <p>4 Archivos</p>
                                    <h4>Gratis</h4>
                                </div>
                                <div className={`price ${subscriptionPlan == "plus" ? " selected" : ""}`} onClick={(e) => setInputValue("subscriptionPlan", "plus")}>
                                    <h3>Plus</h3>
                                    <p>30 Imagenes</p>
                                    <p>8 Archivos</p>
                                    <h4>4.99€ / mes</h4>
                                </div>
                                <div className={`price ${subscriptionPlan == "premium" ? " selected" : ""}`} onClick={(e) => setInputValue("subscriptionPlan", "premium")}>
                                    <h3>Premium</h3>
                                    <p>Imagenes Ilimitadas</p>
                                    <p>Archivos Ilimitados</p>
                                    <h4>14.99€ / mes</h4>
                                </div>
                            </div>
                            {renderPlanWarning()}
                            {last4}
                            <Elements stripe={stripePromise}>
                                <PaymentInfoForm onSubmit={(paymentMethodId) => this.setState({ paymentMethodId })} />
                            </Elements>
                            {errors && <p className="errors">{errors}</p>}

                            <button type="submit">Send</button>
                        </form>
                    }
                    {section == "qrs" &&
                        <form onSubmit={e => generateQrs(e)}>
                            {qr_codes.length > 0 && <p style={{ marginTop: "1em" }}><strong>Haz click derecho</strong> sobre el código QR y selecciona <strong>"Guardar imagen como"</strong> para descargar el código</p>}
                            <p style={{ marginTop: "1em", marginBottom: "1em" }}>Selecciona el idioma que desees y haz click en generar para obtener los codigos QR de tu negocio.</p>
                            <div>
                                <label>Idioma</label>
                                <select name="qrsLanguage" onChange={e => setInputValue(e.target.name, e.target.value)}>
                                    <option value="">Ninguno</option>
                                    <option value="es">Español</option>
                                </select>
                            </div>
                            {errors && <p className="errors">{errors}</p>}
                            <button type="submit">Generar</button>
                            {qr_codes.length > 0 && renderQrs()}
                        </form>
                    }
                </div>}

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
    let business = await res.json()
    let categories = await fetch(`${process.env.FEASTEY_API_URL}/categories`)
    categories = await categories.json()

    const section = ctx.query.section || "business"

    return { business, categories, section }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(EditBusiness)
