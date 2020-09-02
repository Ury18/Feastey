import Layout from '../app/components/Layout'
import Link from 'next/link'
import '../stylesheets/all-businesses.scss'

const AllBusinesses = (props) => {

    const { businesses } = props

    function renderBusinesses() {
        return businesses.map(business => {
            return <Link href={`/business/${business.id}`}>
                <a>
                    {business.name}
                </a>
            </Link>
        })
    }

    return (
        <Layout className="all-businesses">
            <h2>Todos los negocios</h2>
            {businesses && renderBusinesses()}
        </Layout>
    )
}

export const getServerSideProps = async (ctx) => {
    let businesses = await fetch(`${process.env.FEASTEY_API_URL}/business`)
    businesses = await businesses.json()
    return { props: { businesses } }
}

export default AllBusinesses
