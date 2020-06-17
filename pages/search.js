import Layout from '../app/components/Layout'
import Router from 'next/router'
import Link from 'next/link'
import { parseCookies } from '../app/middleware/parseCookies'
import SearchComponent from '../app/components/SearchComponent'

const Search = (props) => {
    return (
        <Layout>
            <SearchComponent></SearchComponent>
        </Layout>
    )
}

Search.getInitialProps = async (ctx) => {
    return {}
}

export default Search

