import Link from 'next/link'
import MainNav from '../MainNav'
import './index.scss'

export default ((props) => {

    return (
        <header className="header">
            <Link href="/">
                <a className="logo-link"><img className="logo" alt="Feastey Logo"src={"/img/feastey_logo.png"}></img></a>
            </Link>
            <Link href="/business">
                <a className="discover_button button">
                    <i className="fas fa-search-location discover_icon" />
                    Descubre tu zona
                </a>
            </Link>
            <MainNav/>
        </header>
    )
})
