import Layout from '../../../app/components/Layout'
import DetailBusiness from '../../../app/components/BusinessDetail'
import Head from 'next/head'

const Business = (props) => {

    const { business } = props

    return (
        <Layout>
            <Head>
                <title>{`${business.name} - Feastey`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content={`${business.name} - Feastey`} key="title" />
                <meta name="description" content={`Pagina de ${business.name} - ${business.summary}.
                Dirección: ${business.address}.
                Categoria: ${business.category.name} - Feastey`} />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content={`${business.name} - Feastey`} />
                <meta name="og:description" property="og:description" content={`Pagina de ${business.name} - ${business.summary}.
                Dirección: ${business.address}.
                Categoria: ${business.category.name} - Feastey`} />
                <meta property="og:site_name" content="ury.feastey.com" />
            </Head>
            <DetailBusiness business={business} />
        </Layout>
    )
}

Business.getInitialProps = async (ctx) => {
    const res = await fetch(`${process.env.FEASTEY_API_URL}/business/${ctx.query.id}`)
    let business = await res.json()
    business.images = business.images.reverse()
    if(business.stripe) delete business.stripe

    return { business }
}

export default Business
