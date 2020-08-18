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
                            Politica de Privacidad
                    </a>
                    </Link>
                    <Link href='/terms-and-conditions'>
                        <a>
                            Terminos y Condiciones
                    </a>
                    </Link>
                    <a href="mailto:feastey@feastey.com">feastey@feastey.com</a>
                </div>
            </div>
        </footer>
    )
})
