import Layout from '../../app/components/Layout'
import Link from 'next/link'

function Users(props) {

    const { data, cookies } = props

    const mapData = (data) => {
        return data.map(item => {
            return <div key={item.id}>
                <Link href={`users/${item.id}`}>
                    <a>
                        <h1>{item.username}</h1>
                    </a>
                </Link>
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
