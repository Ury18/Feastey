import Layout from '../app/components/Layout'

function Users(props) {

    const { data, cookies } = props

    const mapData = (data) => {
        return data.map(item => {
            return <div key={item.id}>
                <h1>{item.username}</h1>
                <p>{item.email}</p>
                <p>{item.role}</p>
                <p>{item.id}</p>
            </div>
        })
    }

    return (
        <Layout {...props}>
            <div>
                {mapData(data)}
            </div>
        </Layout>
    )
}

Users.getInitialProps = async (ctx) => {
    const res = await fetch('http://localhost:3000/api/Users/')
    const data = await res.json()
    return { data }
}

export default Users
