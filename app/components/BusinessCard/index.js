import './index.scss'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { updateUserData } from '../../redux/user/action'
import { connect } from 'react-redux'

const BusinessCard = (props) => {

    const { business, user, updateUserData } = props
    const { token } = user

    const { name, description, location, address } = business

    const [isFaved, setIsFaved] = useState(false)

    const favedImage = require('../../img/feastey_favoriteIcon_faved.png')
    const unfavedImage = require('../../img/feastey_favoriteIcon.png')


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
                        <img onClick={(e) => onToggleFav()} className="favoriteIconCard" src={isFaved ? favedImage : unfavedImage}></img>
                    </div>
                </div>
                <p>{address}</p>
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

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(BusinessCard)
