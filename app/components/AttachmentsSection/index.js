import './index.scss'
import { Component } from 'react'
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
        const { uploadCallback, updateCallback, index } = this.props

        let newFiles = files
        newFiles.push(value)
        this.setState({ files: newFiles },
            () => {
                updateCallback(index, this.state)
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
                    updateCallback(index, this.state)
                }
            })
    }

    onDeleteFile = (e, fileIndex) => {
        e.preventDefault()

        const { updateCallback, deleteCallback, index } = this.props
        const { files } = this.state
        let newFiles = files
        let deleteFileId = files[fileIndex].id
        newFiles.splice(fileIndex, 1)
        this.setState({ files: newFiles })
        if (deleteCallback) deleteCallback(deleteFileId)
        if (updateCallback) updateCallback(index, this.state)

    }

    onDeleteSection = (e) => {
        e.preventDefault()
        const { deleteSectionCallback, index } = this.props
        const { files } = this.state
        if (deleteSectionCallback) deleteSectionCallback(index, files)
    }

    setInputValue = (name, value) => {
        const { updateCallback, index } = this.props
        if (name) {
            this.setState({ [name]: value }, () => {
                if (updateCallback) {
                    updateCallback(index, this.state)
                }
            })
        }
    }

    renderFilesUploader = () => {
        const { files } = this.state
        const { onUpdateFile, onUploadFile, onDeleteFile } = this
        const { tempFileCallback } = this.props

        let newFiles = []

        newFiles = files.map((item, index) => {
            return <FileUploader key={index} index={index} updateCallback={onUpdateFile} uploadCallback={onUploadFile} data={item} tempFileCallback={tempFileCallback} deleteCallback={onDeleteFile} />
        })
        newFiles.push(<label className="newFileLabel">Nuevo archivo</label>)
        newFiles.push(<FileUploader updateCallback={onUpdateFile} uploadCallback={onUploadFile} tempFileCallback={tempFileCallback} deleteCallback={onDeleteFile} />)
        return newFiles
    }

    render() {
        const { name } = this.state
        const { setInputValue, renderFilesUploader, onDeleteSection } = this
        return (
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "4em" }}>
                <p className="delete-section" onClick={e => onDeleteSection(e)}>Eliminar Sección</p>
                <label className="newFileLabel" style={{ fontSize: "1.4em" }}>Nombre de la sección</label>
                <input style={{ marginBottom: ".5em" }} type="text" value={name} name="name" onChange={e => setInputValue(e.target.name, e.target.value)} />
                {renderFilesUploader()}
            </div >
        )
    }

}

export default AttachmentsSection
