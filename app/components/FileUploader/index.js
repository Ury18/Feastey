import './index.scss'
import { useState } from 'react'
import { connect } from 'react-redux'

const FileUploader = ((props) => {

    const { user: { token } } = props


    const [id, setId] = useState()
    const [name, setName] = useState()
    const [newName, setNewName] = useState()
    const [updated, setUpdated] = useState()

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
                }
            })
            .catch(err => {
                console.log(err.error)
            })
    }

    function updateName(e, value) {
        e.preventDefault()
        setNewName(value)
        if (newName == name) {
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
            body: JSON.stringify({name: newName})
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                } else {
                    setName(res.name)
                    setUpdated(true)
                }
            })
            .catch(err => {
                console.log(err.error)
            })
    }

    return (
        <div>
            {!id && <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple={false} onChange={e => uploadFile(e.target.files[0])} />}
            {id && <div>
                <input type="text" text={name} value={newName} onChange={e => updateName(e, e.target.value)} />
                {!updated && <button onClick={e => updateFile(e)}>Guardar</button>}
            </div>
            }
        </div>
    )

})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(FileUploader)
