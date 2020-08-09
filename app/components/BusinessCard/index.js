import './index.scss'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { updateUserData } from '../../redux/user/action'
import { connect } from 'react-redux'

const BusinessCard = (props) => {

    const { business, user, updateUserData } = props
    const { token } = user
    const { name, description, location, address, summary, category } = business

    const [isFaved, setIsFaved] = useState(false)

    const favedImage = '/img/feastey_favoriteIcon_faved.png'
    const unfavedImage = '/img/feastey_favoriteIcon.png'


    useEffect(() => {
        favCheck();
    })

    const favCheck = () => {
        const favorites = user.favorites

        if (user.id) {
            const isFav = favorites.indexOf(business.id)
            if (isFav == -1) {
                setIsFaved(false)
            } else {
                setIsFaved(true)
            }
        }

    }

    const onToggleFav = () => {

        let favorites = props.user.favorites

        if (isFaved) {
            let index = favorites.indexOf(business.id)
            favorites.splice(index, 1)
            setIsFaved(false)
        } else {
            favorites.push(business.id)
            setIsFaved(true)
        }


        fetch(`${process.env.FEASTEY_API_URL}/users/${user.id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ favorites })
        })
            .then(res => res.json())
            .then(res => {
                if (!res.error) {
                    updateUserData({ favorites })
                } else {
                    setIsFaved(!isFaved)
                }
            })

    }

    return (
        <div className="businessCard_Container">
            <div className="businessCard_infoContainer_Header mobile">
                <div>
                    <Link href={`/business/${business.id}`}>
                        <a>
                            <h2>{name}</h2>
                        </a>
                    </Link>
                    <Link href={`/business/${business.id}#map`}>
                        <a>
                            <i className="fas fa-map-marker-alt" aria-hidden="true" />
                        </a>
                    </Link>
                </div>
                <div className="favorite_Container">
                    <img onClick={(e) => onToggleFav()} alt="icono favorito" className="favoriteIconCard" src={isFaved ? favedImage : unfavedImage}></img>
                </div>
            </div>
            <p className="address mobile">{address}</p>
            <div className="businessCard_imgContainer">
                <Link href={`/business/${business.id}`}>
                    <a>
                        {<img className="businessCard_img" alt="Foto de perfil" src={business.mainImage ? business.mainImage.url : business.images[0] ? business.images[0].url : "/img/Table-QR-Template.png"} />}
                    </a>
                </Link>
            </div>
            <div className=" businessCard_infoContainer">
                <div className="businessCard_infoContainer_Header">
                    <div>
                        <Link href={`/business/${business.id}`}>
                            <a>
                                <h2>{name}</h2>
                            </a>
                        </Link>
                        <Link href={`/business/${business.id}#map`}>
                            <a>
                                <i className="fas fa-map-marker-alt" aria-hidden="true" />
                            </a>
                        </Link>
                    </div>
                    <div className="favorite_Container">
                        <img onClick={(e) => onToggleFav()} alt="icono favorito" className="favoriteIconCard" src={isFaved ? favedImage : unfavedImage}></img>
                    </div>
                </div>
                <p className="address">{address}</p>
                {summary && <p className="businessCard_infoContainer_Summary">{summary}</p>}
                <div className="cardFooter">
                    {business.info && business.info.phone && <p className="phone"><i className="fas fa-phone-alt" aria-hidden="true" /><a href={`tel:+${business.info.phone}`}>{business.info.phone}</a></p>}
                    <p className="categories"><span>{category.name}</span></p>
                    {/* <div className="likesContainer">
                        <p>200</p>
                        <img className="likesIconCard" src={"/img/feastey_likeIcon.png"}></img>
                    </div> */}
                </div>
            </div>

        </div>
    )

}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(BusinessCard)
