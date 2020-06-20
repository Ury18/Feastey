import Layout from '../app/components/Layout'
import Discover from '../app/components/Discover'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'

const Index = (props) => {
    const { updateUserData } = props
    return (
        <Layout>
            <Discover/>
            <p>{props.user.name}</p>
            <button onClick={() => updateUserData({ name: "Test2" })}>Set random name</button>
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


