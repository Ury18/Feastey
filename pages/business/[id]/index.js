import Layout from '../../../app/components/Layout'
import { useRouter } from 'next/router'
import DetailBusiness from '../../../app/components/BusinessDetail'

const Business = (props) => {

    const { business } = props
    const router = useRouter()
    const { id } = router.query

    return (
        <Layout>
            <DetailBusiness business={business} />
        </Layout>
    )
}

Business.getInitialProps = async (ctx) => {
    const res = await fetch(`${process.env.FEASTEY_API_URL}/business/${ctx.query.id}`)
    const business = await res.json()
    return { business }
}

export default Business
