import Layout from '../app/components/Layout'
import Head from 'next/head'
import '../stylesheets/help.scss'

const Help = (props) => {
    return (
        <Layout className="help">
            <Head>
                <title>Contacto - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Contacto" key="title" />
                <meta name="description" content="Pagina de Contacto de Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Contacto" />
                <meta name="og:description" property="og:description" content="Pagina de Contacto de Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <section>
                <div>
                    <h1>Contacto</h1>
                    <p>
                        Si deseas contactar con nosotros puedes hacerlo
                        enviando un mail a
                        <strong>
                            <a style={{ color: "#ec9200 !important" }} href="mailto:feastey@feastey.com"> feastey@feastey.com</a>
                        </strong>
                    </p>
                </div>
            </section>
        </Layout>
    )
}

Help.getInitialProps = async (ctx) => {
    return {}
}

export default Help


