import Layout from '../app/components/Layout'
import Head from 'next/head'
import '../stylesheets/custom-catalogues.scss'

const CustomCatalogues = (props) => {
    const { updateUserData } = props
    return (
        <Layout className="custom-catalogue" contentClasses="no-padding-bottom">
            <Head>
                <title>Catálogos Personalizados! - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Catálogos Personalizados! - Feastey" key="title" />
                <meta name="description" content="Si necesitas un catalogo profesional, en Feastey nos encargamos! " />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Catálogos Personalizados! - Feastey" />
                <meta name="og:description" property="og:description" content="Si necesitas un catalogo profesional, en Feastey nos encargamos!" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <section>
                <div>

                    <h2>Catálogos profesionales</h2>
                    <p>
                        Si no tienes tiempo o quieres un catálogo profesional contacta con nosotros en <strong><a href="mailto:feastey@feastey.com">feastey@feastey.com</a></strong> con el asunto<br/>
                        <strong className="black">"Catalogo [Nombre del Negocio]"</strong> y un texto explicandonos como te gustaría que fuera tu catálogo.<br/>
                        Tras estudiarlo nos pondremos en contacto contigo y te ofreceremos un presupuesto acorde a tus necesidades.
                    </p>
                    <h3>Clientes que han confiado en nosotros:</h3>
                    <div className="thumbnails">
                        <div>
                            <img src="/img/catalogue/swing-thumb.png" />
                            <a className="button">Ver</a>
                        </div>
                        <div>
                            <img src="/img/catalogue/coffee-thumb.png" />
                            <a className="button">Ver</a>
                        </div>
                        <div>
                            <img src="/img/catalogue/granja-thumb.png" />
                            <a className="button">Ver</a>
                        </div>
                        <div>
                            <img src="/img/catalogue/cn-thumb.png" />
                            <a className="button">Ver</a>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default CustomCatalogues


