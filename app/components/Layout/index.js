import './index.scss'
import { useEffect } from 'react'
import Header from '../Header'
import { connect } from 'react-redux'
import Cookie from "js-cookie"
import Footer from '../Footer'

const Layout = ((props) => {
    const { contentClasses } = props
    useEffect(() => {
        if(!props.user.token) {
            Cookie.remove("authToken")
        }
    },[])
    return (
        <div className="app">
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
