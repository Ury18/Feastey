import Link from 'next/link'
import './index.scss'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import Cookie from "js-cookie"
import { updateUserData } from '../../redux/user/action'

const MainNav = ((props) => {

    const router = useRouter()
    const [registerBoxActive, setRegisterBoxActive] = useState(false)
    const [accountBoxActive, setAccountBoxActive] = useState(false)

    const { updateUserData } = props

    useEffect(() => {
        window.addEventListener('click', function (e) {
            if (e.target.id !== "registerButtonBox" && e.target.id !== "registerBox") {
                setRegisterBoxActive(false)
            }

            if (e.target.id !== "accountBoxButton" && e.target.id !== "accountBox") {
                setAccountBoxActive(false)
            }
        })
    }, [])

    const registerButtonClick = (e) => {
        e.preventDefault()
        if (registerBoxActive) {
            setRegisterBoxActive(false)
        } else {
            setRegisterBoxActive(true)
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
            myBusiness: [],
            recent: [],
            role: "",
            token: "",
            username: ""
        }

        updateUserData({ ...data })
    }

    return (
        <nav className="mainNav">
            <ul>
                {!props.user.token && <li>
                    <button id="registerButtonBox" onClick={(e) => registerButtonClick(e)}>Registrarse</button>
                    {registerBoxActive && <ul id="registerBox">
                        <li>
                            <Link href="/signup">
                                <a className={router.pathname == "/signup" ? "active" : ""}>Usuario</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/business-signup">
                                <a className={router.pathname == "/business-signup" ? "active" : ""}>Profesional</a>
                            </Link>
                        </li>
                    </ul>}
                </li>}
                {!props.user.token && <li>
                    <Link href="/login">
                        <a className={router.pathname == "/login" ? "active" : ""}>Iniciar Sesión</a>
                    </Link>
                </li>}
                {props.user.token && <li>
                    <button id="accountBoxButton" onClick={(e) => accountButtonClick(e)}>Mi cuenta</button>
                    {accountBoxActive && <ul id="accountBox">
                        <li>
                            <Link href="/signup">
                                <a className={router.pathname == "/signup" ? "active" : ""}>Información de la cuenta</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/users/${props.user.id}/favorites`}>
                                <a className={router.pathname == '/users/[id]/favorites' ? "active" : ""}>Favoritos</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/users/${props.user.id}/my-businesses`}>
                                <a className={router.pathname == '/users/[id]/my-businesses' ? "active" : ""}>Mis negocios</a>
                            </Link>
                        </li>
                        <li>
                            <button onClick={(e) => onExit(e)}>Salir</button>
                        </li>
                    </ul>}
                </li>}
            </ul>
        </nav>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(MainNav)
