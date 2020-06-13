import './index.scss'
import Cookie from "js-cookie"
import { useState, useEffect } from 'react'
import Header from '../Header'

export default ((props) => {
    const [userId, setUserId] = useState()
    const { contentClasses } = props
    useEffect(() => {

    })

    return (
        <div className="app">
            <Header />
            <div className="content-container">
                <div className={`content ${contentClasses}`}>
                    {props.children}
                </div>
            </div>
        </div>
    )
})

