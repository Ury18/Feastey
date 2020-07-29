import './index.scss'
import Link from 'next/link'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import GoogleMap from '../GoogleMap'
import { updateUserData } from '../../redux/user/action'
const Detail = ((props) => {

    const { business, user } = props
    const { token } = user

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

        if (!props.user.id) {
            debugger
            console.log("Log in to add to favorites")
        } else {
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
    }


    const renderAttachmentsList = () => {
        const { attachments } = business
        return attachments.map(attachment => {
            return <li>
                <h2>{attachment.name}</h2>
                <ul>{renderAttachmentFiles(attachment.files)}</ul>
            </li>
        })
    }

    const renderAttachmentFiles = (attachmentFiles) => {

        return attachmentFiles.map(file => {
            return <li className="file_Container">
                <a href={file.url}>
                    <h3>{file.name}</h3>
                </a>
            </li>
        })

    }

    const renderGalleryList = () => {
        const { images } = business
        return images.map(image => {
            return <li><div className="coverImage"><img title={image.name} alt={image.name} src={image.url}></img></div></li>
        })
    }

    return (
        <div className="BusinessDetail_MainContainer">
            <div className="col1">
                {(business.owner == user.id)
                    &&
                    <Link href={`/business/${business.id}/edit`}>
                        <a>Edit</a>
                    </Link>
                }
                <div className="coverImage">
                    <img src={business.mainImage ? business.mainImage.url : business.images[0] ? business.images[0].url : "placeholderImageUrl"}></img>
                </div>
                {business.info !== undefined ?
                    <div className="contactInfo_Container">
                        {business.info.phone && <p>Telf: {business.info.phone}</p>}
                        {business.info.email && <p>Email: {business.info.email}</p>}
                        {business.info.instagram && <p>Instagram: {business.info.instagram}</p>}
                        {business.info.facebook && <p>Facebook {business.info.facebook}</p>}
                    </div> :
                    <div className="contactInfo_Container">
                        <p>Telf:</p>
                        <p>Email:</p>
                        <p>Instagram:</p>
                        <p>Facebook:</p>
                    </div>
                }
            </div>
            <div className="col2">
                <div className="titleAndFavSection_Container">
                    <h2>{business.name}</h2>
                    <p> Location Icon </p>
                    <div className="titleIcons">
                        <p>200</p>
                        <img className="BusinessDetailLikeIcon" src={require('../../img/feastey_likeIcon.png')} />
                        <img onClick={(e) => onToggleFav()} className="BusinessDetailFavIcon" src={isFaved ? favedImage : unfavedImage} />
                    </div>
                </div>
                <p>{business.address}</p>
                <div className="map-container">
                    <GoogleMap class="map" lng={business.location.coordinates[0]} lat={business.location.coordinates[1]} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: business.description }}></div>

                <ul className="section_Container">
                    {renderAttachmentsList()}
                </ul>
                <div className="gallery_Container">
                    <h2>Gallery Component</h2>
                    <ul>
                        {renderGalleryList()}
                    </ul>
                </div>
            </div>
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(Detail)
