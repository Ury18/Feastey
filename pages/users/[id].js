import Layout from '../../app/components/Layout'
import { useRouter } from 'next/router'
import { parseCookies } from '../../app/middleware/parseCookies'

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
        <Layout {...props}>
            <p>{id}</p>
            <div>
                {mapData(data)}
            </div>
        </Layout>
    )
}

UserId.getInitialProps = async (ctx) => {
    const res = await fetch(`http://localhost:3000/api/Users/${context.params.id}`)
    const data = await res.json()
    return { data }
}

export default UserId
