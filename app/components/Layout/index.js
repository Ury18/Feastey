import './index.scss'
import Link from 'next/link'
import Cookie from "js-cookie"
import { useState, useEffect } from 'react'

export default ((props) => {
    // console.log(props)
    const [userId, setUserId] = useState()

    useEffect(() => {

    })

    return (
        <div className="app">
            <header className="header">
                <Link href="/">
                    <a><h1>FEASTEY</h1></a>
                </Link>
            </header>
            <div className="content-container">
                <div className="sidebar">
                    <ul>

                        <li>
                            <Link href="/users">
                                <a>Users</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/login">
                                <a>Log In</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/signup">
                                <a>Sign Up</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    )
})

