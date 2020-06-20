import Layout from '../app/components/Layout'
import Detail from '../app/components/Detail'
import { updateUserData } from '../app/redux/user/action'
import { connect } from 'react-redux'

const DetailPage = (props) => {
    return (
        <Layout>
            <Detail/>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(DetailPage)
