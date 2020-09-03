import Layout from '../app/components/Layout'
import Discover from '../app/components/Discover'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import Head from 'next/head'
import '../stylesheets/homePage.scss'

const Index = (props) => {
    const { updateUserData } = props
    return (
        <Layout className="home" contentClasses="no-padding-bottom no-padding-top">
            <Head>
                <title>Bienvenido a Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Bienvenido a Feastey" key="title" />
                <meta name="description" content="Bienvenido a Feastey - Descubre tu barrio" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Bienvenido a Feastey" />
                <meta name="og:description" property="og:description" content="Bienvenido a Feastey - Descubre tu barrio" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <Discover />
            <section className="white welcome">
                <div>
                    <h1>Bienvenido a Feastey</h1>
                    <p>
                        En Feastey creemos que la <strong>columna vertebral de la economía</strong> de un país está formada por <strong>autónomos y pequeñas empresas.</strong><br />
                        Sin embargo, son los más desfavorecidos a la hora de tener opciones sostenibles para promover su negocio en internet.<br />
                        <br />
                        Feastey nace con el objetivo de dar una solución a este problema y de promover el comercio de proximidad,
                        ofreciendo a las pequeñas empresas la posibilidad de disponer de su propio espacio en la red,
                        donde mostrar sus productos y servicios de manera totalmente <strong>GRATUITA</strong>.
                    </p>
                    <h2>¿Por qué Feastey?</h2>
                    <div className="why-feastey-icons-container">
                        <div>
                            <img src="/img/home/free.png" />
                            <p>Totalmente <strong>GRATIS</strong></p>
                        </div>
                        <div>
                            <img src="/img/home/SEO1st.png" />
                            <p>Consigue un <strong>buen posicionamiento en Google</strong> gracias a nuestro <strong>SEO</strong></p>
                        </div>
                        <div>
                            <img src="/img/home/24-7.png" />
                            <p>Tus productos y servicios <strong>siempre accesibles</strong> las <strong>24 horas</strong> del día los <strong>7 días</strong> a la semana</p>
                        </div>
                        <div>
                            <img src="/img/home/funnel.png" />
                            <p>¡Consigue que te descubran <strong>sin invertir en publicidad!</strong></p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="dark qr-section">
                <div>
                    <div>
                        <h2>Tecnología QR</h2>
                        <p>
                            ¡Te facilitamos los <strong>códigos QR</strong> de tu negocio!<br />
                            <br />
                        Colócalos en tu local para que tus clientes puedan escanearlos y acceder a tus servicios y
                        productos de un modo rápido, limpio y cómodo.
                    </p>
                    </div>
                    <div className="image-container">
                        <img src="/img/home/feastey-sticker.jpeg" />
                    </div>
                </div>
            </section>
            <section className="white radar-section">
                <div>
                    <h2>Tu negocio tiene prioridad</h2>
                    <div>
                        <div>
                            <p>
                                Con nuestro algoritmo de búsqueda, el
                                usuario <strong>descubre los negocios en su proximidad</strong>. Consiguiendo atraer clientes cercanos y
                                <strong> promoviendo el comercio local</strong>.
                            </p>
                            <p>
                                Dispón de <strong>tu propia página</strong> donde exponer toda la
                                información necesaria para que
                                <strong> tus clientes estén informados</strong> sobre tus servicios o productos.
                            </p>
                            <p>
                                Introduce la información de contacto de tu negocio, <strong>sube tus cartas o catálogo de productos</strong> y enseña
                                fotografías de tu establecimiento, productos o lo que tú quieras.
                            </p>
                        </div>
                        <div className="image-container">
                            <img src="/img/home/radar-alt-background.png" />
                        </div>
                    </div>
                </div>

            </section>
            <section className="dark prices">
                <div>
                    <h2>Para todos los bolsillos</h2>
                    <p>
                        Nuestro objetivo es que Feastey sea una plataforma <strong>económica y accesible para todo el mundo.</strong><br />
                        <br />
                        ¡Por lo tanto, ofrecemos un servicio <strong>TOTALMENTE GRATUITO!</strong>
                    </p>
                    <div className="alt-prices">
                        <div className="price">
                            <h3>Free</h3>
                            <div>
                                <p>20 Imágenes</p>
                                <p>4 Archivos</p>
                            </div>
                            <h4>Gratis</h4>
                        </div>
                    </div>
                    <p>
                        Si por lo contrario necesitas una <strong>capacidad mucho más alta</strong> de almacenamiento
                        ofrecemos <strong>dos planes opcionales</strong> a un precio <strong>muy económico</strong>:
                    </p>
                    <div className="alt-prices">
                        <div className="price">
                            <h3>Plus</h3>
                            <div>
                                <p>30 Imágenes</p>
                                <p>8 Archivos</p>
                            </div>
                            <h4>4.99€ / mes</h4>
                        </div>
                        <div className="price">
                            <h3>Premium</h3>
                            <div>
                                <p>Imágenes Ilimitadas</p>
                                <p>Archivos Ilimitados</p>
                            </div>
                            <h4>14.99€ / mes</h4>
                        </div>
                    </div>

                </div>
            </section>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Index)


