import Layout from '../../../app/components/Layout'
import { useRouter } from 'next/router'

const UserId = (props) => {

    const { data } = props
    const router = useRouter()
    const { id } = router.query

    const mapData = (data) => {
        return <div>
            <h1>{data.username}</h1>
            <p>{data.email}</p>
            <p>{data.role}</p>
            <p>{data.id}</p>
        </div>
    }

    return (
        <Layout>
            <p>{id}</p>
            <div>
                {mapData(data)}
            </div>
        </Layout>
    )
}

UserId.getInitialProps = async (ctx) => {
    const res = await fetch(`${process.env.FEASTEY_API_URL}/users/${ctx.query.id}`)
    const data = await res.json()
    return { data }
}

export default UserId
