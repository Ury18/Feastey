import Layout from '../../app/components/Layout'
import Link from 'next/link'
import { connect } from 'react-redux'

function Users(props) {

    const { users, cookies } = props

    const mapData = (users) => {
        return users.map(item => {
            return <div key={item.id}>
                <Link href={`users/${item.id}`}>
                    <a>
                        <h1>{item.username}</h1>
                    </a>
                </Link>
                <p>{item.email}</p>
                <p>{item.role}</p>
                <p>{item.id}</p>
            </div>
        })
    }

    return (
        <Layout>
            <div>
                {mapData(users)}
            </div>
        </Layout>
    )
}

Users.getInitialProps = async (ctx) => {
    const res = await fetch(`${process.env.FEASTEY_API_URL}/users/`)
    const users = await res.json()
    return { users }
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Users)

