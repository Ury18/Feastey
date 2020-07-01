import './index.scss'
import { useState, useEffect, Component } from 'react'
import FileUploader from '../FileUploader'


class AttachmentsSection extends Component {

    state = {
        name: "",
        files: []
    }

    componentDidMount() {
        const { data } = this.props
        if (data) {
            this.setState({ name: data.name, files: data.files })
        }
    }

    onUploadFile = (value) => {
        const { files } = this.state
        const { uploadCallback } = this.props

        let newFiles = files
        newFiles.push(value)
        this.setState({ files: newFiles },
            () => {
                if (uploadCallback && newFiles.length < 2) {
                    uploadCallback(this.state)
                }
            })
    }

    onUpdateFile = (fileIndex, value) => {
        const { files } = this.state
        const { updateCallback, index } = this.props
        let newFiles = files
        newFiles[fileIndex] = value

        this.setState({ files: newFiles },
            () => {
                if (updateCallback) {
                    updateCallback(index,this.state)
                }
            })
    }

    setInputValue = (name, value) => {
        if (name && value) {
            this.setState({ [name]: value })
        }
    }

    renderFilesUploader = () => {
        const { files } = this.state
        const { onUpdateFile, onUploadFile } = this

        let newFiles = []

        newFiles = files.map((item, index) => {
            return <FileUploader index={index} updateCallback={onUpdateFile} uploadCallback={onUploadFile} data={item} />
        })

        newFiles.push(<FileUploader index={files.length} updateCallback={onUpdateFile} uploadCallback={onUploadFile} />)
        return newFiles
    }

    render() {
        const { name } = this.state
        const { setInputValue, renderFilesUploader } = this
        return (
            <div>
                <input type="text" value={name} name="name" onChange={e => setInputValue(e.target.name, e.target.value)} />
                {renderFilesUploader()}
            </div >
        )
    }

}

export default AttachmentsSection
