import './index.scss'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'

const FileUploader = ((props) => {

    const { user: { token }, data, uploadCallback, updateCallback } = props

    const [id, setId] = useState()
    const [name, setName] = useState()
    const [newName, setNewName] = useState()
    const [updated, setUpdated] = useState()
    const [url, setUrl] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        if (data) {
            setId(data.id)
            setName(data.name)
            setNewName(data.name)
            setUpdated(true)
            setUrl(data.url)
        }
    })

    function uploadFile(file) {

        let formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)

        fetch('http://localhost:3000/api/files', {
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

                    },1000)

                    if(uploadCallback) {
                        uploadCallback(res)
                    }
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
    }

    function updateFile(e) {
        e.preventDefault()

        fetch(`http://localhost:3000/api/files/${id}`, {
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

                    if(updateCallback) {
                        updateCallback(res)
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
                    <input type="text" text={name} value={newName} onChange={e => updateName(e, e.target.value)} />
                    {!updated && <button onClick={e => updateFile(e)}>Guardar</button>}
                    {url && type =="image" && <img src={url} alt={name} loading="lazy" width="200px"/>}
                </div>
            }
        </div>
    )

})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(FileUploader)
