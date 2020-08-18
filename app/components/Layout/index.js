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
        if(!props.user.token) {
            Cookie.remove("authToken")
        }
    },[])
    return (
        <div className={`app ${className}`}>
            <Head>
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                {/* <script data-ad-client="ca-pub-1746929838201665" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
            </Head>
            <Header />
            <div className="content-container">
                <div className={`content ${contentClasses || ""}`}>
                    {props.children}
                </div>
            </div>
            <Footer className= "footer"/>
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Layout)
