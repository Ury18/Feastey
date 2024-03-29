import './index.scss'
import { useEffect } from 'react'
import Header from '../Header'
import { connect } from 'react-redux'
import Cookie from "js-cookie"
import Footer from '../Footer'
import Head from 'next/head'
import '@fortawesome/fontawesome-free/css/all.css'

const Layout = ((props) => {
    const { contentClasses, className } = props
    useEffect(() => {
        if (!props.user.token) {
            Cookie.remove("authToken")
        }
    }, [])
    return (
        <div className={`app ${className}` || ""}>
            <Head>
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
            </Head>
            <Header />
            <div className="content-container">
                <div className={`content ${contentClasses || ""}`}>
                    {props.children}
                </div>
            </div>
            <Footer />
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Layout)
