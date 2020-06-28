import './index.scss'
import { useState } from 'react'
import Header from '../Header'

export default ((props) => {
    const [userId, setUserId] = useState()
    const { contentClasses } = props

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
