import Link from 'next/link'
import MainNav from '../MainNav'
import './index.scss'

export default ((props) => {

    return (
        <header className="header">
            <Link href="/">
                <a><img className="logo" src={require("../../img/feastey_logo.png")}></img></a>
            </Link>
            <MainNav/>
        </header>
    )
})
