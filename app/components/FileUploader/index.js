import './index.scss'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const FileUploader = ((props) => {

    const { user: { token }, data, uploadCallback, updateCallback, tempFileCallback, deleteCallback, index } = props

    const [id, setId] = useState()
    const [name, setName] = useState()
    const [newName, setNewName] = useState()
    const [updated, setUpdated] = useState()
    const [url, setUrl] = useState()
    const [type, setType] = useState()
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (data) {
            let tempName = data.tempName || data.name
            setId(data.id)
            setName(data.name)
            setNewName(tempName)
            setUpdated(newName == name)
            setUrl(data.url)
            setType(data.type.split("/")[0])
        }
    })

    function uploadFile(file) {

        setBusy(true)
        let formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)

        fetch(`${process.env.FEASTEY_API_URL}/files`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                    setBusy(false)
                } else {
                    setId(res.id)
                    setName(res.name)
                    setNewName(res.name)
                    setUpdated(true)
                    setType(res.type.split("/")[0])
                    setTimeout(() => {
                        setUrl(res.url)
                        setBusy(false)
                        if (uploadCallback) {
                            res.tempName = res.name
                            uploadCallback(res)
                        }
                        if (tempFileCallback) {
                            tempFileCallback(res)
                        }
                    }, 1000)
                }
            })
            .catch(err => {
                console.log(err.error)
            })
    }

    function updateName(e, value) {
        e.preventDefault()
        setNewName(value)
        if (value === name) {
            setUpdated(true)
        } else {
            setUpdated(false)
        }
        if (updateCallback) {
            data.tempName = value
            updateCallback(index, data)
        }
    }

    function updateFile(e) {
        e.preventDefault()

        fetch(`${process.env.FEASTEY_API_URL}/files/${id}`, {
            method: "PUT",
            headers: {
                "authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ name: newName })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                } else {
                    setName(res.name)
                    setUpdated(true)

                    if (updateCallback) {
                        res.tempName = res.name
                        updateCallback(index, res)
                    }
                }
            })
            .catch(err => {
                console.log(err.error)
            })
    }

    return (
        <div style={{ position: "relative" }}>
            {busy && <div className="fileUploader-busy" />}
            {!id && <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple={false} onChange={e => uploadFile(e.target.files[0])} />}
            {
                id && <div className="fileUploaderContainer">
                    {url && type == "image" && <img src={url} alt={name} loading="lazy" width="200px" />}
                    {url && type !== "image" && <i className="fas fa-file" />}
                    <div>
                        <input type="text" value={newName} onChange={e => updateName(e, e.target.value)} />
                        <i className="fas fa-trash" onClick={e => deleteCallback(e, index)}></i>
                        {!updated && <i className="fas fa-check" onClick={e => updateFile(e)}></i>}
                    </div>
                </div>
            }
        </div>
    )

})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(FileUploader)
