import Link from 'next/link'
import './index.scss'
import { useRouter } from 'next/router'

export default ((props) => {

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
            </ul>
        </nav>
    )
})
