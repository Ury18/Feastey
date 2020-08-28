import Layout from '../app/components/Layout'

const PleaseVerifyUser = (props) => {
    return (
        <Layout contentClasses="centered">
            <h2>Hemos enviado un mensaje a tu email, sigue los pasos para activar tu cuenta.</h2>
            <p style={{marginTop:"1em"}}>(Revisa la carpeta de correo no deseado)</p>
        </Layout>
    )
}

export default PleaseVerifyUser
