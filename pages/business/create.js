import Layout from '../../app/components/Layout'
import { useState, useEffect, Component } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../../app/redux/user/action'
import Router from 'next/router'
import FileUploader from '../../app/components/FileUploader'
import AttachmentsSection from '../../app/components/AttachmentsSection'

class CreateBusiness extends Component {

    state = {
        name: "",
        description: "",
        location: "",
        errors: "",
        images: [],
        attachments: []
    }

    createBusiness = (e) => {
        e.preventDefault()

        const { name, description, location, images } = this.state
        const { id, token } = this.props.user

        let newImages = []

        for (var i = 0; i < images.length; i++) {
            newImages.push(images[i].id)
        }

        let data = {
            name,
            description,
            location,
            images: newImages
        }

        this.setState({ errors: "" })

        data.owner = id;

        fetch('http://localhost:3000/api/business', {
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

    setInputValue = (name, value) => {
        if (name && value) {
            this.setState({ [name]: value })
        }
    }

    renderImagesUploader = () => {
        const { images } = this.state
        const { onUpdateImage, onUploadImage } = this

        let newImages = []

        newImages = images.map((item, index) => {
            return <FileUploader index={index} updateCallback={onUpdateImage} uploadCallback={onUploadImage} data={item} />
        })

        newImages.push(<FileUploader index={images.length} updateCallback={onUpdateImage} uploadCallback={onUploadImage} />)
        return newImages
    }

    renderAttachmentsSection = () => {
        const { attachments } = this.state
        const { onUpdateAttachment, onUploadAttachment } = this

        let newAttachments = []

        newAttachments = attachments.map((item, index) => {
            return <AttachmentsSection index={index} updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} data={item} />
        })

        newAttachments.push(<AttachmentsSection index={attachments.length} updateCallback={onUpdateAttachment} uploadCallback={onUploadAttachment} />)
        return newAttachments
    }

    render() {
        const { user: { token, id } } = this.props
        const { name, description, location, images, errors } = this.state
        const { renderImagesUploader, setInputValue, createBusiness, renderAttachmentsSection } = this

        return (
            <Layout contentClasses="centered">
                <form onSubmit={(e) => createBusiness(e)} style={{ maxWidth: "200px" }}>
                    <h1>Crea tu negocio</h1>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Nombre</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="name" type="text" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Descripción</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="description" type="text" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>Dirección</label>
                        <input onChange={(e) => setInputValue(e.target.name, e.target.value)} name="location" type="text" />
                    </div>

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

CreateBusiness.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(CreateBusiness)
