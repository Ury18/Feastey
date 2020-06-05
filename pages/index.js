import Layout from '../app/components/Layout'
import Router from 'next/router'
import Link from 'next/link'
import { parseCookies } from '../app/middleware/parseCookies'

const Index = (props) => {
    return (
        <Layout {...props} patata = "asdva">
        </Layout>
    )
}

Index.getInitialProps = async (ctx) => {
    return {}
}

export default Index


