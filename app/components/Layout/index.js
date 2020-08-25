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
                {/* {process.env.ENV == "production" && <script data-ad-client="ca-pub-3090102762545817" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>} */}
                {/* {process.env.ENV == "production" && <script dangerouslySetInnerHTML={{
                    __html:
                        `(function(w,d,s,l,i){w[l] = w[l] || []{'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-PTSX94N');`
                }}></script>} */}
            </Head>
            <Header />
            <div className="content-container">
                {/* <noscript>
                    {process.env.ENV == "production" && <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PTSX94N" height="0" width="0" style={{display:"none",visibility:"hidden"}}>
                    </iframe>}
                </noscript> */}
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
