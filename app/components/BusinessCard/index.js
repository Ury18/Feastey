import './index.scss'
import Link from 'next/link'

const BusinessCard = (props) => {

    const { business } = props

    const { name, description, location } = business

    return (
        <div className="businessCard_Container">
            <div className="businessCard_imgContainer">
                <Link href={`/business/${business.id}`}>
                    <a>
                        <div className="businessCard_img"></div>
                    </a>
                </Link>
            </div>
            <div className=" businessCard_infoContainer">
                <div className="businessCard_infoContainer_Header">
                    <Link href={`/business/${business.id}`}>
                        <a>
                            <h2>{name}</h2>
                        </a>
                    </Link>
                    <div className="favorite_Container">
                        <img className="favoriteIconCard" src={require('../../img/feastey_favoriteIcon.png')}></img>
                    </div>
                </div>
                <p>{location.address}</p>
                {description && <p className="businessCard_infoContainer_Description">{description}</p>}
                <div className="cardFooter">
                    <p>Category</p>
                    <div className="likesContainer">
                        <p>200</p>

                        <img className="likesIconCard" src={require("../../img/feastey_likeIcon.png")}></img>

                    </div>

                </div>
            </div>

        </div>
    )

}

export default BusinessCard
