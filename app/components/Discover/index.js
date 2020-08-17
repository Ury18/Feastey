import './index.scss'
import Link from 'next/link'


export default ((props) => {
    return (
        <div>
            <div className="discover_mainContainer">
                <h1 className="discover_title">Descubre tu zona</h1>
                <Link href="/business">
                    <a>
                        <div className="discover_button">
                            <img className="discover_icon" src={"/img/feastey_searchIcon.png"} />
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    )
})
