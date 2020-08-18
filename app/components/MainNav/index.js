import Link from 'next/link'
import './index.scss'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import Cookie from "js-cookie"
import { updateUserData } from '../../redux/user/action'

const MainNav = ((props) => {

    const router = useRouter()
    const [accountBoxActive, setAccountBoxActive] = useState(false)
    const [navActive, setNavActive] = useState(false)
    const { updateUserData } = props

    useEffect(() => {
        window.addEventListener('click', eventClick)

        //ComponentWillUnmount
        return () => {
            window.removeEventListener("click", eventClick)
        }
    }, [])

    const eventClick = (e) => {

        if (e.target.id !== "accountBoxButton" && e.target.id !== "accountBox") {
            setAccountBoxActive(false)
        }
    }

    const accountButtonClick = (e) => {
        e.preventDefault()
        if (accountBoxActive) {
            setAccountBoxActive(false)
        } else {
            setAccountBoxActive(true)
        }
    }

    const onExit = (e) => {
        e.preventDefault()
        Cookie.remove("authToken")

        const data = {
            email: "",
            favorites: [],
            id: "",
            liked: [],
            isVerified: false,
            myBusinesses: [],
            recent: [],
            role: "",
            token: "",
            username: ""
        }

        updateUserData({ ...data })

        router.push("/")
    }

    return (
        <div>
            <nav className="mainNav">
                <ul>
                    {!props.user.token && <li>
                        <Link href="/signup">
                            <a className={router.pathname == "/signup" ? "active" : ""}>Registrarse</a>
                        </Link>
                    </li>}
                    {!props.user.token && <li>
                        <Link href="/login">
                            <a className={router.pathname == "/login" ? "active" : ""}>Iniciar Sesión</a>
                        </Link>
                    </li>}
                    {props.user.token && <li>
                        <button id="accountBoxButton" onClick={(e) => accountButtonClick(e)}><i class="far fa-user"></i>{props.user.username}</button>
                        {accountBoxActive && <ul id="accountBox">
                            <li>
                                <Link href={`/users/edit`}>
                                    <a className={router.pathname == '/users/edit' ? "active" : ""}>Información de la cuenta</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/users/favorites`}>
                                    <a className={router.pathname == '/users/favorites' ? "active" : ""}>Favoritos</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/users/my-businesses`}>
                                    <a className={router.pathname == '/users/my-businesses' ? "active" : ""}>Mis negocios</a>
                                </Link>
                            </li>
                            <li>
                                <button onClick={(e) => onExit(e)}>Salir</button>
                            </li>
                        </ul>}
                    </li>}
                </ul>
            </nav>
            <i className="fas fa-bars button-mobile" aria-hidden="true" onClick={e => setNavActive(!navActive)} />
            <nav className={`mainNav mobile ${navActive ? "active" : ""}`}>
                <i className="closeMenu fas fa-times" onClick={(e) => setNavActive(false)}></i>
                <ul>
                    {!props.user.token && <li>
                        <Link href="/signup">
                            <a className={router.pathname == "/signup" ? "active" : ""}>Registrarse</a>
                        </Link>
                    </li>}
                    {!props.user.token && <li>
                        <Link href="/login">
                            <a className={router.pathname == "/login" ? "active" : ""}>Iniciar Sesión</a>
                        </Link>
                    </li>}
                    {props.user.token && <li>
                        <ul id="accountBox">
                            <li>
                                <Link href={`/users/edit`}>
                                    <a className={router.pathname == '/users/edit' ? "active" : ""}>Información de la cuenta</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/users/favorites`}>
                                    <a className={router.pathname == '/users/favorites' ? "active" : ""}>Favoritos</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/users/my-businesses`}>
                                    <a className={router.pathname == '/users/my-businesses' ? "active" : ""}>Mis negocios</a>
                                </Link>
                            </li>
                            <li>
                                <button onClick={(e) => onExit(e)}>Salir</button>
                            </li>
                        </ul>
                    </li>}
                </ul>
            </nav>
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(MainNav)
