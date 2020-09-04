import Layout from '../app/components/Layout'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import Head from 'next/head'


const Index = (props) => {
    const { updateUserData } = props
    return (
        <Layout>
            <Head>
                <title>Terminos y condiciones - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Terminos y condiciones - Feastey" key="title" />
                <meta name="description" content="Pagina de Terminos y condiciones - Feastey" />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Terminos y condiciones - Feastey" />
                <meta name="og:description" property="og:description" content="Pagina de Terminos y condiciones - Feastey" />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <div>
                <h2>
                    Términos y Condiciones de Uso
                </h2>
                <br />


                <h3>
                    INFORMACIÓN RELEVANTE
                </h3>
                <br />

                <p>
                    Es requisito necesario para la adquisición de los servicios que se ofrecen en este sitio, que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. El uso de nuestros servicios así como la contratación de nuestros planes de suscripción implicará que usted ha leído y aceptado los Términos y Condiciones de Uso en el presente documento. En algunos casos, para adquirir un producto, será necesario el registro por parte del usuario, con ingreso de datos personales fidedignos y definición de una contraseña.

                    El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, en caso de que se haya registrado y que sea necesario para la compra de alguno de nuestros productos. feastey.com no asume la responsabilidad en caso de que entregue dicha clave a terceros.

                    Todas las compras y transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un proceso de confirmación y verificación, el cual podría incluir la validación de la forma de pago, validación de la factura (en caso de existir) y el cumplimiento de las condiciones requeridas por el medio de pago seleccionado. En algunos casos puede que se requiera una verificación por medio de correo electrónico.

                    Los precios de los productos ofrecidos en feastey.com es válido solamente en las compras realizadas en este sitio web.
                </p>
                <br />

                <h3>
                    USO NO AUTORIZADO
                </h3>
                <br/>

                <p>
                    En caso de que aplique (para venta de software, templetes, u otro producto de diseño y programación) usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y ofrecerlos para la redistribución o la reventa de ningún tipo.
                </p>
                <br />

                <h3>
                    PROPIEDAD
                </h3>
                <br />

                <p>
                    Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, modificado o sin modificar. Todos los productos son propiedad  de los proveedores del contenido. En caso de que no se especifique lo contrario, nuestros productos se proporcionan  sin ningún tipo de garantía, expresa o implícita. En ningún caso esta compañía será responsables de ningún daño incluyendo, pero no limitado a, daños directos, indirectos, especiales, fortuitos o consecuentes u otras pérdidas resultantes del uso o de la imposibilidad de utilizar nuestros productos o servicios.
                </p>
                <br />

                <h3>
                    POLÍTICA DE REEMBOLSO Y GARANTÍA
                </h3>
                <br />

                <p>
                    En el caso de productos que sean  mercancías irrevocables no-tangibles, no realizamos reembolsos después de que se envíe el producto, usted tiene la responsabilidad de entender antes de comprarlo.  Le pedimos que lea cuidadosamente antes de comprarlo. Hacemos solamente excepciones con esta regla cuando la descripción no se ajusta al producto. Hay algunos productos que pudieran tener garantía y posibilidad de reembolso pero este será especificado al comprar el producto.
                </p>
                <br />

                <h3>
                    COMPROBACIÓN ANTIFRAUDE
                </h3>
                <br />

                <p>
                    La compra del cliente puede ser aplazada para la comprobación antifraude. También puede ser suspendida por más tiempo para una investigación más rigurosa, para evitar transacciones fraudulentas.
                </p>
                <br />

                <h3>
                    PRIVACIDAD
                </h3>
                <br />

                <p>
                    www.feastey.com garantiza que la información personal que usted envía cuenta con la seguridad necesaria. Los datos ingresados por usuario o en el caso de requerir una validación de los pedidos no serán entregados a terceros, salvo que deba ser revelada en cumplimiento a una orden judicial o requerimientos legales.

                    Feastey reserva los derechos de cambiar o de modificar estos términos sin previo aviso.
                </p>
                <br />

            </div>
        </Layout>
    )
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Index)


