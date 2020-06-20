import './index.scss'
import BusinessCard from '../BusinessCard'

const BusinessList = (props) => {

    const { businessList } = props

    function renderCards(businessList) {
        return businessList.map(business => {
            return <li key={business.id}>
                <BusinessCard business={business}/>
            </li>
        })
    }

    return (
        <ul className="BusinessList">
            {businessList && renderCards(businessList)}
        </ul>
    )

}

export default BusinessList
