import Layout from '../../../app/components/Layout'
import { useRouter } from 'next/router'
import DetailBusiness from '../../../app/components/BusinessDetail'

const UserId = (props) => {

    const { business } = props
    const router = useRouter()
    const { id } = router.query

    return (
        <Layout>
            <DetailBusiness business={business}/>
        </Layout>
    )
}

UserId.getInitialProps = async (ctx) => {
    const res = await fetch(`http://localhost:3000/api/business/${ctx.query.id}`)
    const business = await res.json()
    return { business }
}

export default UserId
