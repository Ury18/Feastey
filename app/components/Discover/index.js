import './index.scss'
import Link from 'next/link'


export default ((props) => {
    return (
        <div><div className="discover_mainContainer">
            <h1 className="discover_title">Descubre tu Barrio</h1>
            <Link href="/business">
                <a>
                    <div className="discover_button">
                        <img className="discover_icon" src={"/img/feastey_searchIcon.png"} />
                    </div>
                </a>
            </Link>


        </div>
        <h1>Bienvendo a Feastey</h1>
        <h2>La plataforma online para el pequeño comercio</h2>
        <p>Haz que tu negocio tenga presencia online sin tener que dejarte un ojo de la cara con una web!</p>
        <p>Con feastey disfrutaras de una plataforma con la que podrás poner tu negocio y tus productos al alcanze de un click
        desde cualquier sitio, en cualquier momento!</p>

        <Link href="/signup">
            <a>Precios y Servicios</a>
        </Link>
        </div>
    )
})
