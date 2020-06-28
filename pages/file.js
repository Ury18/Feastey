import Layout from '../app/components/Layout'
import FileUploader from '../app/components/FileUploader'
import { useEffect } from 'react'
import { connect } from 'react-redux'

const File = (props) => {

    useEffect(() => {

    })

    return (
        <Layout>
            <FileUploader />
        </Layout>
    )
}


File.getInitialProps = async (ctx) => {
    return {}
}


const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(File)
