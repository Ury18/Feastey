import './index.scss'
import { useEffect } from 'react'
import Header from '../Header'
import { connect } from 'react-redux'
import Cookie from "js-cookie"
import Footer from '../Footer'
import Head from 'next/head'


const Layout = ((props) => {
    const { contentClasses } = props
    useEffect(() => {
        if(!props.user.token) {
            Cookie.remove("authToken")
        }
    },[])
    return (
        <div className="app">
            <Head>
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </Head>
            <Header />
            <div className="content-container">
                <div className={`content ${contentClasses}`}>
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
