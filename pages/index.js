import Layout from '../app/components/Layout'
import Discover from '../app/components/Discover'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import Cookie from "js-cookie"


const Index = (props) => {
    const { updateUserData } = props
    return (
        <Layout>
            <Discover/>
            <p>{props.user.name}</p>
            <button onClick={() => Cookie.remove("authToken", {path: "/"})}>Delete Cookie</button>
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


