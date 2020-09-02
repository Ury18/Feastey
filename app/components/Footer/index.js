import Link from 'next/link'
import './index.scss'

export default ((props) => {

    return (
        <footer className="footer">
            <div>
                <Link href='/'>
                    <a className="home-link">
                        <img src="/img/feastey_logo.png" />
                    </a>
                </Link>
                <div>
                    <Link href='/privacy-policy'>
                        <a>
                            Política de Privacidad
                    </a>
                    </Link>
                    <Link href='/terms-and-conditions'>
                        <a>
                            Términos y Condiciones
                    </a>
                    </Link>
                    <a href="mailto:feastey@feastey.com">feastey@feastey.com</a>
                </div>
                <Link href='/all-businesses'>
                    <a className="all-businesses">
                        Todos los negocios
                    </a>
                </Link>
            </div>
        </footer>
    )
})
