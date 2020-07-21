import Layout from '../app/components/Layout'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useEffect, useState } from 'react';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js'

const toolbar = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
}

const Index = (props) => {
    const { updateUserData } = props
    const [state, setState] = useState("")
    const onStateChange = (e) => {
        let value = draftToHtml(convertToRaw(e.getCurrentContent()));
        value = value.replace(/(?:\r\n|\r|\n)/g, "<br>")
        setState(value)
    }
    return (
        <Layout>
            <p>Rich Text Test Page</p>
            <div>
                {/* <Editor/> */}
                <Editor toolbar={toolbar} onEditorStateChange={onStateChange} />
            </div>
            <div dangerouslySetInnerHTML={{ __html: state }}></div>
        </Layout>
    )
}

Index.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Index)


