import Link from 'next/link'
import './index.scss'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'

const MainNav = ((props) => {

    const router = useRouter()

    return (
        <nav className="mainNav">
            <ul>
                <li>
                    <Link href="/signup">
                        <a className={router.pathname == "/signup" ? "active" : ""}>Registrarse</a>
                    </Link>
                </li>
                <li>
                    <Link href="/business-signup">
                        <a className={router.pathname == "/business-signup" ? "active" : ""}>Regsitrarse como profesional</a>
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        <a className={router.pathname == "/login" ? "active" : ""}>Iniciar Sesión</a>
                    </Link>
                </li>
                <li>
                    <Link href="/users">
                        <a className={router.pathname == "/users" ? "active" : ""}>Usuarios</a>
                    </Link>
                </li>
                <li>
                    <Link href="/file">
                        <a className={router.pathname == "/file" ? "active" : ""}>File</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(MainNav)
