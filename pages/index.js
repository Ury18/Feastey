import Layout from '../app/components/Layout'
import Router from 'next/router'
import Link from 'next/link'
import { parseCookies } from '../app/middleware/parseCookies'
import Discover from '../app/components/Discover'

const Index = (props) => {
    return (
        <Layout {...props} patata = "asdva">
            <Discover/>
        </Layout>
    )
}

Index.getInitialProps = async (ctx) => {
    return {}
}

export default Index


