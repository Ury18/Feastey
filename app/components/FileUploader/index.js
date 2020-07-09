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
                } else {
                    setId(res.id)
                    setName(res.name)
                    setNewName(res.name)
                    setUpdated(true)
                    setType(res.type.split("/")[0])
                    setTimeout(() => {
                        setUrl(res.url)
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
        <div>
            {!id && <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple={false} onChange={e => uploadFile(e.target.files[0])} />}
            {
                id && <div>
                    <input type="text" value={newName} onChange={e => updateName(e, e.target.value)} />
                    <button onClick={e => deleteCallback(e, index) }>DELETE</button>
                    {!updated && <button onClick={e => updateFile(e)}>Guardar</button>}
                    {url && type == "image" && <img src={url} alt={name} loading="lazy" width="200px" />}
                </div>
            }
        </div>
    )

})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(FileUploader)
