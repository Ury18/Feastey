import Layout from '../../app/components/Layout'
import BusinessList from '../../app/components/BusinessList'

const AllBusiness = (props) => {
    const { businessList } = props
    return (
        <Layout>
            <BusinessList businessList={businessList} />
        </Layout>
    )
}

AllBusiness.getInitialProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/api/business/')
    const businessList = await res.json()
    return { businessList }
}

export default AllBusiness

