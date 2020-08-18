import './index.scss'
import Link from 'next/link'


export default ((props) => {
    return (
        <section className="discover_section">
            <div>
                <Link href="/business">
                    <a className="discover_button button">
                        <i class="fas fa-search-location discover_icon" />
                    Descubre tu zona
                </a>
                </Link>
            </div>
        </section>
    )
})
