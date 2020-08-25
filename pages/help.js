import Layout from '../app/components/Layout'
import Head from 'next/head'
import '../stylesheets/help.scss'

const Help = (props) => {
    return (
        <Layout className="help">
            <Head>
                <title>Sección de Ayuda - Feastey</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Sección de Ayuda" key="title" />
                <meta name="description" content="Página de Ayuda donde consultar todo lo necesario para poner a punto la página de tu negocio." />
                <meta property="og:type" content="website" />
                <meta name="og:title" property="og:title" content="Sección de Ayuda" />
                <meta name="og:description" property="og:description" content="Página de Ayuda donde consultar todo lo necesario para poner a punto la página de tu negocio." />
                <meta property="og:site_name" content={`${process.env.HOST}`} />
            </Head>
            <section>
                <div>
                    <h1>Sección de Ayuda</h1>
                </div>
                <div>
                    <h2>Cómo crear una página de negocio</h2>
                    <ol>
                        <li>
                            <p>Haz click sobre tu nombre de usuario en la esquina superior derecha o sobre el menú de navegación ( <i className="fas fa-bars" /> ) si estás en dispositivo móvil.</p>
                        </li>
                        <li>
                            <p>Haz click en <strong>"Mis Negocios".</strong></p>
                        </li>
                        <li>
                            <p>Haz click en crear nuevo negocio.</p>
                        </li>
                        <li>
                            <p>Rellena el formulario con la información necesaria.</p>
                        </li>
                        <li>
                            <p>Cuando hayas rellenado todos los campos necesarios pulsa en <strong>"Guardar"</strong> para crear el negocio.</p>
                        </li>
                    </ol>
                    <p>Si tienes alguna otra duda al crear la página de tu negocio, puedes consultar las otras secciones para una explicación más detallada.</p>
                </div>

                <div>
                    <h2>Cómo editar una página de negocio</h2>
                    <ol>
                        <li>
                            <p>Haz click sobre tu nombre de usuario en la esquina superior derecha o sobre el menú de navegación ( <i className="fas fa-bars" /> ) si estás en dispositivo móvil.</p>
                        </li>
                        <li>
                            <p>Haz click en <strong>"Mis Negocios".</strong></p>
                        </li>
                        <li>
                            <p>Haz click en el negocio que quieras editar.</p>
                        </li>
                        <li>
                            <p>Haz click en el botón <strong>"Editar Página"</strong></p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo cambiar el nombre de archivos e imágenes</h2>
                    <ol>
                        <li>
                            <p>Accede a la página de edición del negocio</p>
                        </li>
                        <li>
                            <p>Modifica el nombre del archivo o imagen, aparecerá el símbolo de confirmación ( <i className="fas fa-check" /> ) una vez modificado, pulsa en él para guardar los cambios</p>
                            <img src="/img/help/file-example.png" />
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo generar los códigos QR</h2>
                    <ol>
                        <li>
                            <p>Haz click sobre tu nombre de usuario en la esquina superior derecha o sobre el menú de navegación ( <i className="fas fa-bars" /> ) si estás en dispositivo móvil.</p>
                        </li>
                        <li>
                            <p>Haz click en <strong>"Mis Negocios".</strong></p>
                        </li>
                        <li>
                            <p>Haz click en el negocio cuyos códigos QR quieras generar.</p>
                        </li>
                        <li>
                            <p>Haz click en el botón <strong>"Editar Página"</strong></p>
                        </li>
                        <li>
                            <p>Haz click en la sección <strong>"Códigos QR"</strong>.</p>
                        </li>
                        <li>
                            <p>Selecciona el idioma deseado para tus códigos QR y haz click en <strong>"Generar"</strong>.</p>
                        </li>
                        <li>
                            <p>Para descargar un código QR, haz click derecho sobre el código, seguidamente haz click en <strong>"Guardar Imagen Cómo"</strong> y selecciona donde quieres guardar el código QR.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo añadir y modificar la dirección del negocio</h2>
                    <h4>Añadir la dirección a mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en la sección de dirección e introduce la dirección de tu negocio</p>
                        </li>
                        <li>
                            <p>Una vez introducido, aparecerá el símbolo de confirmación ( <i className="fas fa-check" /> ), pulsa en él para confirmar tu dirección</p>
                        </li>
                        <li>
                            <p>Sigue rellenando la informmación necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>
                    <h4>Cambiar la dirección a mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en la sección de dirección e introduce la nueva dirección de tu negocio</p>
                        </li>
                        <li>
                            <p>Una vez introducido, aparecerá el símbolo de confirmación ( <i className="fas fa-check" /> ), pulsa en él para confirmar tu dirección</p>
                        </li>
                        <li>
                            <p>Haz click en el botón <strong>"Guardar"</strong> al final del formulario, para confirmar los ajustes.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo añadir y modificar la descripción del negocio</h2>
                    <h4>Añadir la descripción a mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en la sección de Descripción e introduce el texto de la descripción de tu negocio</p>
                        </li>
                        <li>
                            <p> Una vez introducida la descripción, simplemente sigue rellenando la información necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>

                    <h4>Modificar la descripción a mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en la sección de Descripción y modifica el texto de la descripción de tu negocio.</p>
                        </li>
                        <li>
                            <p> Una vez modificada la descripción, haz click en el botón <strong>"Guardar"</strong> al final del formulario, para confirmar los ajustes.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo añadir y eliminar la imagen de perfil del negocio</h2>
                    <h4>Añadir la imagen de perfil de mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en el botón <strong>"Seleccionar Archivo"</strong> (Puede cambiar según el idioma del navegador) en la sección de Imagen de Perfil.</p>
                        </li>
                        <li>
                            <p>Selecciona la imagen que desees desde el explorador de archivos.</p>
                        </li>
                        <li>
                            <p> Una vez añadida la Imagen de Perfil, simplemente sigue rellenando la información necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>

                    <h4>Eliminar la imagen de perfil de mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en el icono de la papelera ( <i className="fas fa-trash" /> ) para eliminar la Imagen de Perfil.</p>
                        </li>
                        <li>
                            <p> Una vez eliminada la Imagen de Perfil, haz click en el botón <strong>"Guardar"</strong> al final del formulario, para confirmar los ajustes.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo añadir y eliminar imágenes de la galería</h2>
                    <h4>Añadir imágenes a la galería de mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en el botón <strong>"Seleccionar Archivo"</strong> (Puede cambiar según el idioma del navegador) en la sección de Galería de Imágenes.</p>
                        </li>
                        <li>
                            <p>Selecciona la imagen que desees desde el explorador de archivos.</p>
                        </li>
                        <li>
                            <p> Una vez añadidas las imágenes, simplemente sigue rellenando la información necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>

                    <h4>Eliminar las Imágenes de la galería mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Haz click en el icono de la papelera ( <i className="fas fa-trash" /> ) para eliminar la imagen.</p>
                        </li>
                        <li>
                            <p> Una vez eliminadas las imágenes, haz click en el botón <strong>"Guardar"</strong> al final del formulario, para confirmar los ajustes.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo añadir, eliminar o cambiar el título a una sección de archivos</h2>
                    <h4>Añadir una sección de archivos a mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Introduce el nombre de la sección</p>
                        </li>
                        <li>
                            <p>Haz click en el botón <strong>"Seleccionar Archivo"</strong> (Puede cambiar según el idioma del navegador) para añadir un archivo a la sección.</p>
                        </li>
                        <li>
                            <p>Selecciona el archivo que desees desde el explorador de archivos.</p>
                        </li>
                        <li>
                            <p> Una vez añadido el archivo, puedes seguir añadiendo más o simplemente sigue rellenando la información necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>

                    <h4>Cambiar el título de una sección de archivos de mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Cambia el nombre de la sección</p>
                        </li>
                        <li>
                            <p> Una vez cambiado el título de la sección de archivos, simplemente sigue rellenando la información necesaria y al llegar al final del formulario haz click en el botón <strong>"Guardar"</strong> para confirmar los ajustes.</p>
                        </li>
                    </ol>

                    <h4>Eliminar una sección de archivos de mi negocio.</h4>
                    <ol>
                        <li>
                            <p>Elimina todos los archivos de una sección para eliminarla.</p>
                        </li>
                        <li>
                            <p> Una vez eliminados todos los archivos de una sección, haz click en el botón <strong>"Guardar"</strong> al final del formulario, para confirmar los ajustes.</p>
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Plan de suscripción</h2>
                    <h3>Por defecto se selecciona el Plan Gratuito</h3>
                    <br />
                    <h4>Cómo cambiar de plan de suscripción de un negocio.</h4>
                    <ol>
                        <li>Desde la página de Edición del Negocio, haz click en la sección <strong>"Información de pago y suscripción"</strong> </li>
                        <li>Selecciona el plan deseado</li>
                        <li>Introduce la información de pago en caso de no haberlo hecho previamente</li>
                        <li>Haz click en <strong>"Confirmar método de pago"</strong> si es la primera vez que introduces dicha información</li>
                        <li>Haz click en <strong>"Guardar"</strong></li>
                    </ol>
                </div>

                <div>
                    <h2>Cómo cambiar el método de pago de un negocio</h2>
                    <ol>
                        <li>Desde la página de Edición del Negocio, haz click en la sección <strong>"Información de pago y suscripción"</strong> </li>
                        <li>Introduce la información de pago</li>
                        <li>Haz click en <strong>"Confirmar método de pago"</strong></li>
                        <li>Haz click en <strong>"Guardar"</strong></li>
                    </ol>
                </div>

                <div id="pdf">
                    <h2>Cómo guardar un archivo en pdf</h2>
                    <h3>Para este ejemplo, usaremos Microsoft Word, si estás usando otro programa, el funcionamiento debería ser similar.</h3>
                    <ol>
                        <li>Haz click en <strong>"Archivo"</strong> </li>
                        <li>Haz click en <strong>"Guardar Cómo"</strong></li>
                        <li>Debajo del nombre, aparece una sección en la que se puede escoger el formato del archivo.</li>
                        <li>Haz click en el desplegable y selecciona <strong>".pdf"</strong></li>
                        <li>Haz click en <strong>"Guardar"</strong></li>
                    </ol>
                </div>

            </section>
        </Layout>
    )
}

export default Help


